"use client";

import { useState } from "react";
import Link from "next/link";
import { NavLink, NavTrigger } from "./nav-item";
import { CascadeList } from "./cascade-list";

export type SidebarEntry = { slug: string; title: string; date: string };

export interface SidebarProps {
  blogs: SidebarEntry[];
  projects: SidebarEntry[];
}

export function Sidebar({ blogs, projects }: SidebarProps) {
  const [openBlogs, setOpenBlogs] = useState(false);
  const [openProjects, setOpenProjects] = useState(false);

  return (
    <aside className="w-[220px] shrink-0 bg-surface border-r border-border min-h-screen flex flex-col py-6">
      <Link
        href="/home"
        className="font-sans text-xs uppercase tracking-[0.32em] text-paper px-6 pb-6 border-b border-border mb-4 hover:text-accent transition-colors"
      >
        MY PROLOGUE
      </Link>
      <nav className="flex flex-col">
        <NavTrigger open={openBlogs} onToggle={() => setOpenBlogs((v) => !v)}>
          Blog
        </NavTrigger>
        <CascadeList
          entries={blogs}
          basePath="/blog"
          viewAllHref="/blog"
          open={openBlogs}
        />
        <NavTrigger open={openProjects} onToggle={() => setOpenProjects((v) => !v)}>
          Projects
        </NavTrigger>
        <CascadeList
          entries={projects}
          basePath="/projects"
          viewAllHref="/projects"
          open={openProjects}
        />
        <NavLink href="/about">About</NavLink>
      </nav>
    </aside>
  );
}
