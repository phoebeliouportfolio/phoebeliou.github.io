import type { Project } from "../types/project";

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch("/data/projects.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load projects.json: ${res.status}`);
  return (await res.json()) as Project[];
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await fetchProjects();
  return projects.find(p => p.slug === slug) ?? null;
}
