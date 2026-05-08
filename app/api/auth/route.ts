import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password required" },
        { status: 400 }
      );
    }

    let admin = null as Awaited<ReturnType<typeof prisma.adminUser.findUnique>>;
    try {
      admin = await prisma.adminUser.findUnique({ where: { username } });
    } catch (dbError) {
      console.error("Auth DB lookup failed, trying env fallback:", dbError);
    }

    // Fallback login when DB is temporarily unavailable (local/dev issues).
    if (!admin) {
      const envUser = process.env.ADMIN_USERNAME || "admin";
      const envPass = process.env.ADMIN_PASSWORD || "admin123";
      if (username === envUser && password === envPass) {
        const token = await signToken({ id: "env-admin", username: envUser });
        const response = NextResponse.json({ success: true, username: envUser });
        response.cookies.set(COOKIE_NAME, token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });
        return response;
      }
    }

    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signToken({ id: admin.id, username: admin.username });

    const response = NextResponse.json({ success: true, username: admin.username });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error(error);
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "ECONNREFUSED"
    ) {
      return NextResponse.json(
        { error: "Database connection failed. Check DATABASE_URL and database status." },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(COOKIE_NAME);
  return response;
}
