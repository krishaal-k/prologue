import { Sidebar } from "../../components/shell/sidebar";
import { ProjectCard } from "../../components/content/project-card";
import { getAllPosts, getAllProjects } from "../../lib/content";

export default async function ProjectsIndex() {
  const [posts, projects] = await Promise.all([getAllPosts(), getAllProjects()]);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        blogs={posts.map(({ slug, title, date }) => ({ slug, title, date }))}
        projects={projects.map(({ slug, title, date }) => ({ slug, title, date }))}
      />
      <main className="flex-1 p-12 max-w-4xl">
        <h1 className="font-serif text-4xl text-paper mb-10">Projects</h1>
        <div className="grid gap-6">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </main>
    </div>
  );
}
