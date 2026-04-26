import Link from "next/link";

export type CascadeEntry = { slug: string; title: string; date: string };

interface CascadeListProps {
  entries: CascadeEntry[];
  basePath: string;
  viewAllHref: string;
  open: boolean;
}

export function CascadeList({ entries, basePath, viewAllHref, open }: CascadeListProps) {
  if (!open) return null;

  const visible = entries.slice(0, 10);
  const hasMore = entries.length > 10;

  return (
    <div className="transition-all duration-150">
      {visible.map((entry) => (
        <Link
          key={entry.slug}
          href={`${basePath}/${entry.slug}`}
          className="block pl-10 pr-6 py-1.5 text-xs text-muted hover:text-paper transition-colors"
        >
          {entry.title}
        </Link>
      ))}
      {hasMore && (
        <Link
          href={viewAllHref}
          className="block pl-10 pr-6 py-1.5 text-xs uppercase tracking-[0.18em] text-accent hover:text-paper transition-colors"
        >
          View all →
        </Link>
      )}
    </div>
  );
}
