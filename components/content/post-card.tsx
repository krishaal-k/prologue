import Link from "next/link";
import type { Post } from "../../lib/content";

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(
    new Date(dateStr),
  );
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block cursor-pointer bg-surface border border-border rounded-md p-6 transition-all duration-200 hover:border-accent hover:-translate-y-0.5"
    >
      <h2 className="font-serif text-xl text-paper font-semibold leading-snug">
        {post.title}
      </h2>

      <p className="font-sans text-sm text-muted leading-relaxed mt-2">
        {post.summary}
      </p>

      <time
        dateTime={post.date}
        className="block text-xs uppercase tracking-[0.18em] text-muted mt-3"
      >
        {formatDate(post.date)}
      </time>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-[0.16em] bg-bg text-muted border border-border"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
