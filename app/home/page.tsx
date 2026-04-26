import { Sidebar } from "../../components/shell/sidebar";
import { PostCard } from "../../components/content/post-card";
import { getAllPosts, getAllProjects } from "../../lib/content";

export default async function HomePage() {
  const [posts, projects] = await Promise.all([getAllPosts(), getAllProjects()]);
  const recent = posts.slice(0, 5);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        blogs={posts.map(({ slug, title, date }) => ({ slug, title, date }))}
        projects={projects.map(({ slug, title, date }) => ({ slug, title, date }))}
      />
      <main className="flex-1 p-12 max-w-4xl">
        <section className="mb-16">
          <p className="text-xs uppercase tracking-[0.22em] text-muted mb-4">Mission</p>
          <h1 className="font-serif text-4xl leading-tight text-paper mb-4">
            You&rsquo;re not learning to code. You&rsquo;re learning to build.
          </h1>
          <p className="font-serif text-lg text-muted">
            The portfolio is not the product. <span className="text-paper">You</span> are the product.
          </p>
        </section>

        <section>
          <div className="flex items-baseline justify-between mb-6">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Recent posts</p>
            {posts.length > 5 && (
              <a href="/blog" className="text-xs uppercase tracking-[0.22em] text-accent hover:text-paper">
                View all →
              </a>
            )}
          </div>
          <div className="grid gap-6">
            {recent.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
