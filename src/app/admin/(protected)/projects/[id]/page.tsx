import { notFound } from "next/navigation";
import { getProjectForm, getTechnologyOptions } from "@/lib/data/admin";
import { ProjectForm } from "./project-form";

// Reads the session: allowed to block (Cache Components instant validation).
export const instant = false;

export default async function AdminProjectPage({
  params,
}: PageProps<"/admin/projects/[id]">) {
  const { id } = await params;
  const [project, technologies] = await Promise.all([
    getProjectForm(id),
    getTechnologyOptions(),
  ]);
  if (!project) notFound();

  return (
    <main className="gut flex-1 py-12">
      <ProjectForm
        projectId={id}
        defaultValues={project.values}
        redirects={project.redirects}
        technologies={technologies}
        mediaBaseUrl={project.mediaBaseUrl}
      />
    </main>
  );
}
