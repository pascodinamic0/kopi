"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, Package, MoreHorizontal } from "lucide-react";
import clsx from "clsx";

export function BottomNav() {
  const pathname = usePathname();
  const items = [
    { href: "/", label: "Accueil", icon: Home, active: pathname === "/" },
    {
      href: "/jobs",
      label: "Travaux",
      icon: Briefcase,
      active: pathname?.startsWith("/jobs"),
    },
    {
      href: "/stock",
      label: "Stock",
      icon: Package,
      active: pathname?.startsWith("/stock"),
    },
    {
      href: "/settings",
      label: "Plus",
      icon: MoreHorizontal,
      active:
        pathname?.startsWith("/settings") ||
        pathname?.startsWith("/credit") ||
        pathname?.startsWith("/demo"),
    },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-line/80 bg-surface/90 backdrop-blur-xl">
      <div className="mx-auto grid max-w-screen-sm grid-cols-4 gap-1 px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+10px)]">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={clsx(
                "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition active:scale-95",
                it.active ? "bg-brand-soft text-brand" : "text-muted hover:bg-surface-2"
              )}
            >
              <Icon size={20} strokeWidth={it.active ? 2.4 : 2} />
              <span>{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
