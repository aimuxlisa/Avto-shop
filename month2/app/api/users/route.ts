import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../lib/session";
import { db } from "../../../lib/turso";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const result = await db.execute(
    "SELECT id, name, email, role, avatar_url, is_active, created_at FROM users ORDER BY created_at DESC"
  );

  return NextResponse.json({ users: result.rows });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { name, email, password, role = "manager", avatar_url } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Все поля обязательны" }, { status: 400 });
    }

    // Check if email already registered
    const existing = await db.execute({
      sql: "SELECT id FROM users WHERE email = ?",
      args: [email],
    });

    if (existing.rows.length > 0) {
      return NextResponse.json({ error: "Пользователь с таким email уже существует" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    await db.execute({
      sql: "INSERT INTO users (id, name, email, password_hash, role, avatar_url, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, 1, ?)",
      args: [id, name, email, passwordHash, role, avatar_url || null, createdAt],
    });

    return NextResponse.json({
      user: { id, name, email, role, avatar_url: avatar_url || null, is_active: 1, created_at: createdAt },
    });
  } catch (err) {
    console.error("Create user error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id, name, email, password, role, is_active, avatar_url } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "User ID обязателен" }, { status: 400 });
    }

    // Cannot deactivate oneself
    if (id === session.userId && is_active === 0) {
      return NextResponse.json({ error: "Вы не можете деактивировать собственный аккаунт" }, { status: 400 });
    }

    // If changing email, ensure it's not already taken
    if (email) {
      const existing = await db.execute({
        sql: "SELECT id FROM users WHERE email = ? AND id != ?",
        args: [email, id],
      });
      if (existing.rows.length > 0) {
        return NextResponse.json({ error: "Пользователь с таким email уже существует" }, { status: 400 });
      }
    }

    const fields: string[] = [];
    const args: (string | number | null)[] = [];

    if (name !== undefined) {
      fields.push("name = ?");
      args.push(name);
    }

    if (email !== undefined) {
      fields.push("email = ?");
      args.push(email);
    }

    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      fields.push("password_hash = ?");
      args.push(passwordHash);
    }

    if (avatar_url !== undefined) {
      fields.push("avatar_url = ?");
      args.push(avatar_url || null);
    }

    if (is_active !== undefined) {
      fields.push("is_active = ?");
      args.push(is_active ? 1 : 0);
    }

    if (role !== undefined) {
      fields.push("role = ?");
      args.push(role);
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: "Нет данных для обновления" }, { status: 400 });
    }

    args.push(id);
    await db.execute({
      sql: `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      args,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update user error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
