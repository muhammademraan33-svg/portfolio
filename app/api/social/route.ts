import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    const socials = await prisma.socialLink.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json(socials);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const social = await prisma.socialLink.create({
      data: {
        platform: data.platform,
        url: data.url,
        icon: data.icon || data.platform.toLowerCase(),
        sortOrder: data.sortOrder || 0,
      },
    });
    return NextResponse.json(social, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create social link" }, { status: 500 });
  }
}
