import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import {ArrowLeft, ExternalLink, Calendar, Tag} from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/SocialIcons";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) return { title: "Project Not Found" };
  return {
    title: project.title,
    description: project.description,
  };
}

export async function generateStaticParams() {
  try {
    const projects = await prisma.project.findMany({ select: { slug: true } });
    return projects.map((p) => ({ slug: p.slug }));
  } catch {
    // DB not available at build time (e.g. local build without PostgreSQL)
    return [];
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });

  if (!project) notFound();

  const relatedProjects = await prisma.project.findMany({
    where: { category: project.category, NOT: { id: project.id } },
    take: 3,
  });

  const tags = (() => {
    try {
      return JSON.parse(project.tags) as string[];
    } catch {
      return [];
    }
  })();

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0f" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-indigo-500/10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/#projects"
            className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Back to Portfolio
          </Link>
          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-slate-400 hover:text-white text-sm transition-colors"
              >
                <GithubIcon size={14} />
                GitHub
              </a>
            )}
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium"
              >
                <ExternalLink size={14} />
                Live Demo
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="tag">{project.category}</span>
            {project.featured && (
              <span className="px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
                ⭐ Featured Project
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-100 mb-4">
            {project.title}
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed max-w-3xl mb-6">
            {project.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-indigo-400" />
              {formatDate(project.date)}
            </div>
            {tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-indigo-400" />
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag: string) => (
                    <span key={tag} className="tag text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Project image */}
        <div className="rounded-2xl overflow-hidden border border-indigo-500/20 bg-gradient-to-br from-indigo-950 to-purple-950 aspect-video mb-12">
          {project.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-9xl font-bold gradient-text opacity-20">
                {project.title[0]}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {project.longDesc && (
          <div className="glass rounded-2xl p-8 mb-12">
            <h2 className="text-xl font-bold text-slate-100 mb-4">
              About This Project
            </h2>
            <div className="text-slate-400 leading-relaxed whitespace-pre-wrap">
              {project.longDesc}
            </div>
          </div>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-4 mb-16">
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
            >
              <ExternalLink size={16} />
              View Live Project
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl glass text-slate-300 font-semibold hover:text-white transition-all"
            >
              <GithubIcon size={16} />
              View Source Code
            </a>
          )}
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-slate-100 mb-6">
              Related Projects
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedProjects.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/projects/${rel.slug}`}
                  className="glass rounded-xl p-5 hover:border-indigo-500/30 transition-all card-hover block"
                >
                  <span className="tag text-xs mb-3 block w-fit">
                    {rel.category}
                  </span>
                  <h4 className="font-semibold text-slate-200 mb-1 hover:text-indigo-300 transition-colors">
                    {rel.title}
                  </h4>
                  <p className="text-slate-500 text-xs line-clamp-2">
                    {rel.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
