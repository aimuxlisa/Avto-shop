import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/turso";
import crypto from "crypto";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = session.role === "admin";
  const sql = `
    SELECT 
      l.*,
      c.name as client_name,
      c.phone as client_phone,
      u.name as assigned_name,
      u.avatar_url as assigned_avatar
    FROM leads l
    JOIN clients c ON l.client_id = c.id
    LEFT JOIN users u ON l.assigned_to = u.id
    ${isAdmin ? "" : "WHERE l.assigned_to = ?"}
    ORDER BY l.created_at DESC
  `;

  const args = isAdmin ? [] : [session.userId];
  const result = await db.execute({ sql, args });

  return NextResponse.json({ ok: true, leads: result.rows });
}

export async function POST(req: NextRequest) {
  // 1. Check Authorization: either User Session or Server-to-Server API Secret
  const session = await getSession();

  const crmApiSecret = process.env.CRM_API_SECRET;
  const authHeader =
    req.headers.get("x-crm-api-secret") ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const isServerAuthorized = Boolean(
    crmApiSecret && authHeader && authHeader === crmApiSecret
  );

  if (!session && !isServerAuthorized) {
    return NextResponse.json(
      { ok: false, error: "Неавторизованный запрос" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    // Check if this is the website form format: { name, contact, message, source }
    if (body.source === "website_form" || ("contact" in body && "name" in body)) {
      const { name, contact, message, source } = body;

      // Validate source
      if (source !== "website_form") {
        return NextResponse.json(
          { ok: false, error: "Недопустимый источник заявки (ожидается website_form)" },
          { status: 400 }
        );
      }

      // Validate required fields
      if (!name || typeof name !== "string" || !name.trim()) {
        return NextResponse.json(
          { ok: false, error: "Имя (name) обязательно для заполнения" },
          { status: 400 }
        );
      }

      if (!contact || typeof contact !== "string" || !contact.trim()) {
        return NextResponse.json(
          { ok: false, error: "Контакт (contact) обязателен для заполнения" },
          { status: 400 }
        );
      }

      if (!message || typeof message !== "string" || !message.trim()) {
        return NextResponse.json(
          { ok: false, error: "Сообщение (message) обязательно для заполнения" },
          { status: 400 }
        );
      }

      const trimmedName = name.trim();
      const trimmedContact = contact.trim();
      const trimmedMessage = message.trim();

      // 2. Find or create client by contact (phone or email)
      const clientLookup = await db.execute({
        sql: "SELECT id, name, phone, email FROM clients WHERE phone = ? OR email = ? LIMIT 1",
        args: [trimmedContact, trimmedContact],
      });

      let clientId: string;
      const now = new Date().toISOString();

      if (clientLookup.rows.length > 0) {
        // Client exists: use existing clientId without duplicating
        clientId = clientLookup.rows[0].id as string;

        // Idempotency / Duplicate protection:
        // Check if an active lead with identical notes was created for this client in the last 10 minutes
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
        const existingRecentLead = await db.execute({
          sql: `SELECT id FROM leads 
                WHERE client_id = ? 
                  AND source = 'website_form' 
                  AND notes = ? 
                  AND created_at >= ? 
                ORDER BY created_at DESC LIMIT 1`,
          args: [clientId, trimmedMessage, tenMinutesAgo],
        });

        if (existingRecentLead.rows.length > 0) {
          // Return the existing lead to avoid accidental double submission
          return NextResponse.json(
            {
              ok: true,
              leadId: existingRecentLead.rows[0].id,
              clientId,
            },
            { status: 200 }
          );
        }
      } else {
        // Client does not exist: create new client
        clientId = crypto.randomUUID();
        const isEmail = trimmedContact.includes("@");
        const phone = isEmail ? "" : trimmedContact;
        const email = isEmail ? trimmedContact : null;

        await db.execute({
          sql: "INSERT INTO clients (id, name, phone, email, notes, created_at) VALUES (?, ?, ?, ?, ?, ?)",
          args: [
            clientId,
            trimmedName,
            phone || trimmedContact,
            email,
            "Клиент создан автоматически через форму сайта Vespera",
            now,
          ],
        });
      }

      // 3. Create lead in Turso
      const leadId = crypto.randomUUID();

      // Determine assigned user if available
      let assignedUserId: string | null = null;
      if (session) {
        assignedUserId = session.userId;
      } else {
        // Pick first active admin or manager for auto-assignment, or null
        const firstUser = await db.execute(
          "SELECT id FROM users WHERE is_active = 1 ORDER BY CASE WHEN role = 'admin' THEN 0 ELSE 1 END LIMIT 1"
        );
        if (firstUser.rows.length > 0) {
          assignedUserId = firstUser.rows[0].id as string;
        }
      }

      await db.execute({
        sql: `INSERT INTO leads (id, client_id, source, status, assigned_to, value, notes, created_at, updated_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          leadId,
          clientId,
          "website_form",
          "new",
          assignedUserId,
          null,
          trimmedMessage,
          now,
          now,
        ],
      });

      return NextResponse.json(
        {
          ok: true,
          leadId,
          clientId,
        },
        { status: 201 }
      );
    }

    // Standard internal CRM UI creation flow: { client_id, source, value, notes, assigned_to }
    const { client_id, source = "manual", value, notes, assigned_to } = body;

    if (!client_id) {
      return NextResponse.json(
        { ok: false, error: "Client ID обязателен" },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const assignedUserId =
      session?.role === "admin" ? assigned_to || session.userId : session?.userId || null;

    await db.execute({
      sql: `INSERT INTO leads (id, client_id, source, status, assigned_to, value, notes, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        client_id,
        source,
        "new",
        assignedUserId,
        value ? Number(value) : null,
        notes || null,
        now,
        now,
      ],
    });

    return NextResponse.json({
      ok: true,
      leadId: id,
      clientId: client_id,
      lead: {
        id,
        client_id,
        source,
        status: "new",
        assigned_to: assignedUserId,
        value,
        notes,
        created_at: now,
        updated_at: now,
      },
    });
  } catch (err) {
    console.error("Create lead error:", err);
    return NextResponse.json(
      { ok: false, error: "Ошибка сервера при обработке заявки" },
      { status: 500 }
    );
  }
}
