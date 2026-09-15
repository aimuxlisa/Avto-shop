import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/session";
import { db } from "../../../../lib/turso";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Check task ownership
  const check = await db.execute({
    sql: "SELECT * FROM tasks WHERE id = ?",
    args: [id],
  });

  const task = check.rows[0];
  if (!task) {
    return NextResponse.json({ error: "Задача не найдена" }, { status: 404 });
  }

  if (session.role !== "admin" && task.assigned_to !== session.userId) {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  try {
    const { status, due_date } = await req.json();

    const fields: string[] = [];
    const args: (string | null)[] = [];

    if (status !== undefined) {
      fields.push("status = ?");
      args.push(status);
    }
    if (due_date !== undefined) {
      fields.push("due_date = ?");
      args.push(due_date);
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: "Нет полей для обновления" }, { status: 400 });
    }

    args.push(id);
    await db.execute({
      sql: `UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`,
      args,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update task error:", err);
    return NextResponse.json({ error: "Ошибка при обновлении" }, { status: 500 });
  }
}
