import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const slug = data.slug || slugify(data.title);

    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        longDesc: data.longDesc || "",
        category: data.category,
        date: data.date,
        projectUrl: data.projectUrl || "",
        githubUrl: data.githubUrl || "",
        image: data.image || "",
        featured: data.featured || false,
        tags: JSON.stringify(data.tags || []),
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
