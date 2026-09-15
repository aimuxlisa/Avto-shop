import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../lib/turso";
import bcrypt from "bcryptjs";
import { createSession } from "../../../../lib/session";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const result = await db.execute({
      sql: "SELECT * FROM users WHERE email = ?",
      args: [email]
    });

    const user = result.rows[0];

    if (!user || user.is_active === 0) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash as string);

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    await createSession(user.id as string, user.role as string);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
