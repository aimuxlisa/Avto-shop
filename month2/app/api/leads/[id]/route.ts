import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/session";
import { db } from "../../../../lib/turso";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const leadResult = await db.execute({
    sql: `
      SELECT 
        l.*,
        c.name as client_name,
        c.phone as client_phone,
        c.email as client_email,
        u.name as assigned_name
      FROM leads l
      JOIN clients c ON l.client_id = c.id
      LEFT JOIN users u ON l.assigned_to = u.id
      WHERE l.id = ?
    `,
    args: [id],
  });

  const lead = leadResult.rows[0];
  if (!lead) {
    return NextResponse.json({ error: "Сделка не найдена" }, { status: 404 });
  }

  // Permission check: if manager, lead must be assigned to them
  if (session.role !== "admin" && lead.assigned_to !== session.userId) {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  // Tasks related to this lead
  const tasksResult = await db.execute({
    sql: `SELECT t.*, u.name as assigned_name 
          FROM tasks t 
          LEFT JOIN users u ON t.assigned_to = u.id 
          WHERE t.lead_id = ? 
          ORDER BY t.created_at DESC`,
    args: [id],
  });

  return NextResponse.json({
    lead,
    tasks: tasksResult.rows,
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Check lead existence & permission
  const check = await db.execute({
    sql: "SELECT * FROM leads WHERE id = ?",
    args: [id],
  });

  const currentLead = check.rows[0];
  if (!currentLead) {
    return NextResponse.json({ error: "Сделка не найдена" }, { status: 404 });
  }

  if (session.role !== "admin" && currentLead.assigned_to !== session.userId) {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { status, assigned_to, notes, value } = body;

    const fields: string[] = [];
    const args: (string | number | null)[] = [];

    if (status !== undefined) {
      fields.push("status = ?");
      args.push(status);
    }
    if (session.role === "admin" && assigned_to !== undefined) {
      fields.push("assigned_to = ?");
      args.push(assigned_to);
    }
    if (notes !== undefined) {
      fields.push("notes = ?");
      args.push(notes);
    }
    if (value !== undefined) {
      fields.push("value = ?");
      args.push(value !== null ? Number(value) : null);
    }

    fields.push("updated_at = ?");
    args.push(new Date().toISOString());

    args.push(id);

    await db.execute({
      sql: `UPDATE leads SET ${fields.join(", ")} WHERE id = ?`,
      args,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update lead error:", err);
    return NextResponse.json({ error: "Ошибка при обновлении" }, { status: 500 });
  }
}
