import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/turso";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await db.execute({
    sql: "SELECT id, name, email, role, avatar_url FROM users WHERE id = ?",
    args: [session.userId],
  });

  const user = result.rows[0];
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar_url,
    },
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, avatar_url, password } = await req.json();

    const fields: string[] = [];
    const args: (string | null)[] = [];

    if (name !== undefined) {
      fields.push("name = ?");
      args.push(name);
    }

    if (avatar_url !== undefined) {
      fields.push("avatar_url = ?");
      args.push(avatar_url || null);
    }

    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      fields.push("password_hash = ?");
      args.push(passwordHash);
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: "Нет данных для обновления" }, { status: 400 });
    }

    args.push(session.userId);
    await db.execute({
      sql: `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      args,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update profile error:", err);
    return NextResponse.json({ error: "Ошибка при обновлении профиля" }, { status: 500 });
  }
}
