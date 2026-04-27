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
          <p className="text-xs uppercase tracking-[0.22em] text-muted mb-4">Welcome</p>
          <h1 className="font-serif text-4xl leading-tight text-paper mb-4">
            This is my prologue. I have no idea what I&rsquo;m doing. Follow along.
          </h1>
          <p className="font-serif text-lg text-muted mb-4">
            I&rsquo;m teaching myself to build things. I don&rsquo;t know exactly what yet &mdash; but I&rsquo;m developing the skills, curiosity, and taste to figure it out along the way. The point is to make things I actually care about.
          </p>
          <p className="font-serif text-lg text-muted mb-4">
            This site is where I think out loud. I&rsquo;ll be writing about what I&rsquo;m learning, what I&rsquo;m noticing as the technology landscape evolves, how I feel about it all, and what I&rsquo;m trying to build. My blog will be my voice &mdash; raw and unfiltered. Well, I&rsquo;ll probably get AI to tidy up the grammar so I don&rsquo;t look like an idiot, but that&rsquo;s it. I promise. The projects section is where I&rsquo;ll post the stuff I actually build.
          </p>
          <p className="font-serif text-lg text-muted">
            I&rsquo;ll be honest &mdash; this is mostly for me, but you&rsquo;re welcome to follow along.
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
