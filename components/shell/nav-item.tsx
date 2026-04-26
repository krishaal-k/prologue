import Link from "next/link";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

interface NavTriggerProps {
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function NavLink({ href, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="block px-6 py-2.5 text-sm text-paper hover:text-accent transition-colors"
    >
      {children}
    </Link>
  );
}

export function NavTrigger({ open, onToggle, children }: NavTriggerProps) {
  return (
    <button
      onClick={onToggle}
      className="flex justify-between items-center w-full px-6 py-2.5 text-sm text-paper hover:text-accent transition-colors"
    >
      <span>{children}</span>
      <span>{open ? "▾" : "▸"}</span>
    </button>
  );
}
