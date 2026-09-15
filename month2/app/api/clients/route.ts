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
  const q = searchParams.get("q")?.trim() || "";

  let sql = "SELECT * FROM clients";
  const args: (string | number)[] = [];

  if (q) {
    sql += " WHERE name LIKE ? OR phone LIKE ? OR email LIKE ?";
    const searchArg = `%${q}%`;
    args.push(searchArg, searchArg, searchArg);
  }

  sql += " ORDER BY created_at DESC";

  const result = await db.execute({ sql, args });
  return NextResponse.json({ clients: result.rows });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, phone, email, notes } = await req.json();

    if (!name || !phone) {
      return NextResponse.json({ error: "Имя и телефон обязательны" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    await db.execute({
      sql: "INSERT INTO clients (id, name, phone, email, notes, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      args: [id, name, phone, email || null, notes || null, createdAt],
    });

    return NextResponse.json({
      client: { id, name, phone, email, notes, created_at: createdAt },
    });
  } catch (error) {
    console.error("Create client error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
