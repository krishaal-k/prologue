import Link from "next/link";
import type { Project } from "../../lib/content";

const statusStyles: Record<Project["status"], string> = {
  live: "bg-accent text-bg",
  wip: "border border-accent text-accent bg-transparent",
  archived: "text-muted opacity-60",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="block cursor-pointer bg-surface border border-border rounded-md p-6 transition-all duration-200 hover:border-accent hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-serif text-xl text-paper font-semibold leading-snug">
          {project.title}
        </h2>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-[0.18em] shrink-0 ${statusStyles[project.status]}`}
        >
          {project.status.toUpperCase()}
        </span>
      </div>

      <p className="font-sans text-sm text-muted leading-relaxed mt-2">
        {project.summary}
      </p>

      {project.tech.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          {project.tech.map((t) => (
            <span
              key={t}
              className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-[0.16em] bg-bg text-muted border border-border"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
