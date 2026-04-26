import { notFound } from "next/navigation";
import { Sidebar } from "../../../components/shell/sidebar";
import { MdxContent } from "../../../components/content/mdx-content";
import { getAllPosts, getAllProjects, getProjectBySlug } from "../../../lib/content";

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map(({ slug }) => ({ slug }));
}

export default async function ProjectPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, allPosts, allProjects] = await Promise.all([
    getProjectBySlug(slug),
    getAllPosts(),
    getAllProjects(),
  ]);
  if (!project) notFound();

  return (
    <div>
      <Sidebar
        blogs={allPosts.map(({ slug: s, title, date }) => ({ slug: s, title, date }))}
        projects={allProjects.map(({ slug: s, title, date }) => ({ slug: s, title, date }))}
      />
      <main>
        <h1>{project.title}</h1>
        <MdxContent source={project.body} />
      </main>
    </div>
  );
}
