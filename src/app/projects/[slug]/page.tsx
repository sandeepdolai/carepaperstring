import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getNeighbors, getProject, projects } from "@/lib/projects";
import { ProjectSheet } from "@/components/site/project-sheet";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return {
    title: project ? `${project.title} — Jesper Landberg` : "Jesper Landberg",
    description: project?.description,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const { prev, next } = getNeighbors(slug);

  return (
    <>
      <div className="sr-only">
        <h1>{project.title}</h1>
        <p>{project.description}</p>
      </div>
      <ProjectSheet project={project} prev={prev} next={next} />
    </>
  );
}
