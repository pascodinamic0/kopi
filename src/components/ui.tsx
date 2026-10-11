"use client";
import clsx from "clsx";
import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "soft" | "dark";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-brand-ink hover:bg-brand-strong shadow-[0_8px_20px_-10px_var(--brand)]",
  secondary: "bg-surface text-ink border border-line hover:bg-surface-2",
  ghost: "text-ink hover:bg-surface-2",
  danger: "bg-danger text-white hover:opacity-90",
  soft: "bg-brand-soft text-brand hover:brightness-95",
  dark: "bg-ink text-white hover:opacity-90",
};
const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm rounded-xl gap-1.5",
  md: "h-11 px-4.5 text-[15px] rounded-2xl gap-2",
  lg: "h-14 px-6 text-base rounded-2xl gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  block,
  className,
  children,
  disabled,
  type = "button",
  ...rest
}: {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
} & Omit<HTMLMotionProps<"button">, "children">) {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      disabled={disabled}
      className={clsx(
        "inline-flex select-none items-center justify-center font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        block && "w-full",
        className
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

export function Card({
  className,
  children,
  ...rest
}: {
  className?: string;
  children: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx("card", className)} {...rest}>
      {children}
    </div>
  );
}

export function GlassCard({
  className,
  children,
  ...rest
}: {
  className?: string;
  children: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx("glass rounded-[1.25rem] shadow-soft", className)} {...rest}>
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  tone = "default",
  icon,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: "default" | "ok" | "danger" | "gold" | "info";
  icon?: ReactNode;
}) {
  const tones = {
    default: "bg-surface-2 text-muted",
    ok: "bg-ok-soft text-ok",
    danger: "bg-danger-soft text-danger",
    gold: "bg-gold-soft text-gold",
    info: "bg-info-soft text-info",
  };
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
        {icon ? (
          <span className={clsx("inline-flex h-8 w-8 items-center justify-center rounded-xl", tones[tone])}>
            {icon}
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-2xl font-bold tabular tracking-tight text-ink">{value}</p>
      {sub ? <p className="mt-1 text-xs text-muted">{sub}</p> : null}
    </Card>
  );
}

export function NavTile({
  href,
  title,
  subtitle,
  image,
}: {
  href: string;
  title: string;
  subtitle: string;
  image?: string;
}) {
  return (
    <Link href={href} className="group relative overflow-hidden rounded-[1.25rem] border border-line bg-surface shadow-soft active:scale-[0.98]">
      {image ? (
        <div className="relative h-24 overflow-hidden">
          <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        </div>
      ) : null}
      <div className="p-4">
        <div className="text-[15px] font-semibold text-ink">{title}</div>
        <div className="mt-0.5 text-sm text-muted">{subtitle}</div>
      </div>
    </Link>
  );
}

export function Field({
  label,
  children,
  className,
}: {
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={clsx("block", className)}>
      {label ? <span className="mb-1.5 block text-sm font-medium text-muted">{label}</span> : null}
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-2xl border border-line bg-surface px-3.5 py-3 text-[15px] text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";
