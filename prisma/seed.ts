import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL || "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Admin user
  const passwordHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "admin123",
    12
  );
  await prisma.adminUser.upsert({
    where: { username: process.env.ADMIN_USERNAME || "admin" },
    update: {},
    create: {
      username: process.env.ADMIN_USERNAME || "admin",
      passwordHash,
    },
  });

  // About info
  await prisma.aboutInfo.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      name: "Alex Johnson",
      title: "Full Stack Developer & UI/UX Designer",
      bio: "I'm a passionate full-stack developer with 5+ years of experience building modern, scalable web applications. I love turning complex problems into elegant solutions and crafting exceptional user experiences.",
      email: "alex@example.com",
      phone: "+1 (555) 000-0000",
      location: "San Francisco, CA",
      heroHeading: "Building Digital Experiences That Matter",
      heroSub:
        "Full Stack Developer|UI/UX Designer|Open Source Enthusiast",
      avatarUrl: "",
      resumeUrl: "#",
    },
  });

  // Skills
  const skills = [
    { name: "React / Next.js", level: 95, category: "Frontend", sortOrder: 1 },
    { name: "TypeScript", level: 90, category: "Frontend", sortOrder: 2 },
    { name: "Tailwind CSS", level: 92, category: "Frontend", sortOrder: 3 },
    { name: "Node.js", level: 88, category: "Backend", sortOrder: 4 },
    { name: "PostgreSQL", level: 82, category: "Backend", sortOrder: 5 },
    { name: "Prisma ORM", level: 85, category: "Backend", sortOrder: 6 },
    { name: "Docker", level: 75, category: "DevOps", sortOrder: 7 },
    { name: "AWS / Vercel", level: 78, category: "DevOps", sortOrder: 8 },
    { name: "Figma", level: 80, category: "Design", sortOrder: 9 },
    { name: "GraphQL", level: 72, category: "Backend", sortOrder: 10 },
  ];

  for (const skill of skills) {
    await prisma.skill.create({ data: skill });
  }

  // Social links
  const socials = [
    { platform: "GitHub", url: "https://github.com", icon: "github", sortOrder: 1 },
    { platform: "LinkedIn", url: "https://linkedin.com", icon: "linkedin", sortOrder: 2 },
    { platform: "Twitter", url: "https://twitter.com", icon: "twitter", sortOrder: 3 },
    { platform: "Dribbble", url: "https://dribbble.com", icon: "dribbble", sortOrder: 4 },
  ];

  for (const social of socials) {
    await prisma.socialLink.create({ data: social });
  }

  // Sample projects
  const projects = [
    {
      title: "E-Commerce Platform",
      slug: "e-commerce-platform",
      description: "A full-featured e-commerce solution with real-time inventory management",
      longDesc: "Built a complete e-commerce platform with product management, cart functionality, Stripe payments, and an admin dashboard. Features include real-time inventory tracking, order management, and customer analytics.",
      category: "Full Stack",
      date: "2024-01",
      projectUrl: "https://example.com",
      githubUrl: "https://github.com",
      featured: true,
      tags: JSON.stringify(["Next.js", "Prisma", "Stripe", "PostgreSQL"]),
    },
    {
      title: "AI-Powered Task Manager",
      slug: "ai-task-manager",
      description: "Smart task management app with AI-based prioritization and scheduling",
      longDesc: "An intelligent task management application that uses OpenAI to automatically prioritize tasks, suggest deadlines, and generate subtasks. Built with React, Node.js, and integrated with OpenAI's GPT-4 API.",
      category: "Web App",
      date: "2024-03",
      projectUrl: "https://example.com",
      githubUrl: "https://github.com",
      featured: true,
      tags: JSON.stringify(["React", "OpenAI", "Node.js", "MongoDB"]),
    },
    {
      title: "Real-Time Chat Application",
      slug: "realtime-chat-app",
      description: "WebSocket-based chat app with rooms, DMs, and file sharing",
      longDesc: "A scalable real-time chat application supporting thousands of concurrent users. Features include chat rooms, direct messages, file sharing, message reactions, and read receipts.",
      category: "Full Stack",
      date: "2023-11",
      projectUrl: "https://example.com",
      githubUrl: "https://github.com",
      featured: false,
      tags: JSON.stringify(["Socket.io", "React", "Redis", "Node.js"]),
    },
    {
      title: "Design System & Component Library",
      slug: "design-system",
      description: "A comprehensive design system with 50+ reusable React components",
      longDesc: "Created a fully documented component library with 50+ accessible React components following WCAG 2.1 guidelines. Includes Storybook documentation, automated testing, and NPM publishing.",
      category: "UI/UX",
      date: "2023-08",
      projectUrl: "https://example.com",
      githubUrl: "https://github.com",
      featured: false,
      tags: JSON.stringify(["React", "TypeScript", "Storybook", "Tailwind"]),
    },
  ];

  for (const project of projects) {
    await prisma.project.create({ data: project });
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
