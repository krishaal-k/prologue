import { Sidebar } from "../../components/shell/sidebar";
import { PostCard } from "../../components/content/post-card";
import { getAllPosts, getAllProjects } from "../../lib/content";

export default async function BlogIndex() {
  const [posts, projects] = await Promise.all([getAllPosts(), getAllProjects()]);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        blogs={posts.map(({ slug, title, date }) => ({ slug, title, date }))}
        projects={projects.map(({ slug, title, date }) => ({ slug, title, date }))}
      />
      <main className="flex-1 p-12 max-w-4xl">
        <h1 className="font-serif text-4xl text-paper mb-10">Blog</h1>
        <div className="grid gap-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
}
