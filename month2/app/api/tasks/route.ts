import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../lib/session";
import { db } from "../../../lib/turso";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter") || "my"; // "my" | "all"

  const isAdmin = session.role === "admin";
  const shouldShowAll = isAdmin && filter === "all";

  const sql = `
    SELECT 
      t.*,
      u.name as assigned_name,
      c.name as client_name,
      l.id as lead_ref
    FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    LEFT JOIN clients c ON t.client_id = c.id
    LEFT JOIN leads l ON t.lead_id = l.id
    ${shouldShowAll ? "" : "WHERE t.assigned_to = ?"}
    ORDER BY 
      CASE WHEN t.status = 'pending' THEN 0 ELSE 1 END,
      t.due_date ASC,
      t.created_at DESC
  `;

  const args = shouldShowAll ? [] : [session.userId];
  const result = await db.execute({ sql, args });

  return NextResponse.json({ tasks: result.rows });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, due_date, lead_id, client_id, assigned_to } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Заголовок задачи обязателен" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const assignedUserId = (session.role === "admin" && assigned_to) ? assigned_to : session.userId;

    await db.execute({
      sql: `INSERT INTO tasks (id, lead_id, client_id, assigned_to, title, due_date, status, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`,
      args: [
        id,
        lead_id || null,
        client_id || null,
        assignedUserId,
        title,
        due_date || null,
        createdAt,
      ],
    });

    return NextResponse.json({
      task: {
        id,
        lead_id,
        client_id,
        assigned_to: assignedUserId,
        title,
        due_date,
        status: "pending",
        created_at: createdAt,
      },
    });
  } catch (err) {
    console.error("Create task error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
