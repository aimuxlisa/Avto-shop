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

  const clientResult = await db.execute({
    sql: "SELECT * FROM clients WHERE id = ?",
    args: [id],
  });

  const client = clientResult.rows[0];
  if (!client) {
    return NextResponse.json({ error: "Клиент не найден" }, { status: 404 });
  }

  // Leads for this client
  const leadsResult = await db.execute({
    sql: `SELECT l.*, u.name as assigned_name 
          FROM leads l 
          LEFT JOIN users u ON l.assigned_to = u.id 
          WHERE l.client_id = ? 
          ORDER BY l.created_at DESC`,
    args: [id],
  });

  // Tasks for this client
  const tasksResult = await db.execute({
    sql: `SELECT t.*, u.name as assigned_name 
          FROM tasks t 
          LEFT JOIN users u ON t.assigned_to = u.id 
          WHERE t.client_id = ? 
          ORDER BY t.created_at DESC`,
    args: [id],
  });

  return NextResponse.json({
    client,
    leads: leadsResult.rows,
    tasks: tasksResult.rows,
  });
}
