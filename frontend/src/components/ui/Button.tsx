import { Link } from "react-router-dom";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "donate" | "secondary" | "ghost";

type ButtonProps = {
  children: ReactNode;
  to?: string;
  href?: string;
  variant?: ButtonVariant;
  className?: string;
};

const styles: Record<ButtonVariant, string> = {
  primary:
    "bg-trust-700 text-white hover:-translate-y-0.5 hover:bg-trust-900 shadow-lg shadow-trust-700/15",
  donate:
    "bg-ambergold-500 text-ink hover:-translate-y-0.5 hover:bg-ambergold-300 shadow-lg shadow-ambergold-500/20",
  secondary:
    "border border-trust-700 text-trust-700 hover:-translate-y-0.5 hover:bg-trust-50",
  ghost: "text-trust-700 hover:-translate-y-0.5 hover:bg-trust-50",
};

export function Button({
  children,
  to,
  href,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-200";
  const classes = `${base} ${styles[variant]} ${className}`;

  if (to) {
    return (
      <Link className={classes} to={to}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a className={classes} href={href}>
        {children}
      </a>
    );
  }

  return <button className={classes}>{children}</button>;
}
