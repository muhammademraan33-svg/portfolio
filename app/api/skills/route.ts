import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json(skills);
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
    const skill = await prisma.skill.create({
      data: {
        name: data.name,
        level: Number(data.level),
        category: data.category || "Technical",
        icon: data.icon || "",
        sortOrder: data.sortOrder || 0,
      },
    });
    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}
