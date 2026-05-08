import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ContactSection from "@/components/sections/ContactSection";

export const revalidate = 60;

async function getPortfolioData() {
  try {
    const [about, skills, projects, socials] = await Promise.all([
      prisma.aboutInfo.findFirst(),
      prisma.skill.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.project.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.socialLink.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);
    return { about, skills, projects, socials };
  } catch {
    return { about: null, skills: [], projects: [], socials: [] };
  }
}

export default async function HomePage() {
  const { about, skills, projects, socials } = await getPortfolioData();

  const defaultAbout = {
    id: "main",
    name: "Alex Johnson",
    title: "Full Stack Developer & UI/UX Designer",
    bio: "I'm a passionate developer building modern web applications with clean code and exceptional user experiences.",
    email: "alex@example.com",
    phone: "",
    location: "San Francisco, CA",
    resumeUrl: "#",
    heroHeading: "Building Digital Experiences That Matter",
    heroSub: "Full Stack Developer|UI/UX Designer|Problem Solver",
    avatarUrl: "",
  };

  const aboutData = about || defaultAbout;

  return (
    <div className="noise">
      <Navbar />
      <main>
        <HeroSection about={aboutData} socials={socials} />
        <AboutSection about={aboutData} />
        <SkillsSection skills={skills} />
        <ProjectsSection projects={projects} />
        <ContactSection about={aboutData} socials={socials} />
      </main>
      <Footer socials={socials} name={aboutData.name} />
    </div>
  );
}
