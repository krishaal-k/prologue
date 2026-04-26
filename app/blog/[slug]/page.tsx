import { notFound } from "next/navigation";
import { Sidebar } from "../../../components/shell/sidebar";
import { MdxContent } from "../../../components/content/mdx-content";
import { getAllPosts, getAllProjects, getPostBySlug } from "../../../lib/content";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(({ slug }) => ({ slug }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, allPosts, allProjects] = await Promise.all([
    getPostBySlug(slug),
    getAllPosts(),
    getAllProjects(),
  ]);
  if (!post) notFound();

  return (
    <div className="flex min-h-screen">
      <Sidebar
        blogs={allPosts.map(({ slug: s, title, date }) => ({ slug: s, title, date }))}
        projects={allProjects.map(({ slug: s, title, date }) => ({ slug: s, title, date }))}
      />
      <main className="flex-1 p-12 max-w-3xl">
        <article>
          <h1 className="font-serif text-4xl text-paper mb-4">{post.title}</h1>
          <MdxContent source={post.body} />
        </article>
      </main>
    </div>
  );
}
