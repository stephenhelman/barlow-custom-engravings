"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useOrderModal } from "@/store/useOrderModal";

const navLinks = [
  { href: "/gallery", label: "Gallery" },
  { href: "/shop", label: "Shop" },
  { href: "/order", label: "Custom Order" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const open = useOrderModal((s) => s.open);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      className={`
        sticky top-0 z-40 w-full transition-all duration-300
        ${scrolled ? "bg-bg/90 backdrop-blur-md border-b border-border" : "bg-transparent"}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-lg font-semibold text-text whitespace-nowrap shrink-0 hover:text-leather-light transition-colors"
        >
          Barlow Custom Engravings
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-body transition-colors ${
                pathname === link.href
                  ? "text-leather-light"
                  : "text-text-muted hover:text-text"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={`tel:${process.env.NEXT_PUBLIC_PHONE}`}
            className="text-sm font-body text-text-muted hover:text-text transition-colors"
          >
            {process.env.NEXT_PUBLIC_PHONE}
          </a>
          <Button
            size="sm"
            onClick={() => open()}
            className="shrink-0"
          >
            Custom Order
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-text-muted hover:text-text p-1 transition-colors"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface border-b border-border px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-body py-1 transition-colors ${
                pathname === link.href
                  ? "text-leather-light"
                  : "text-text-muted hover:text-text"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`tel:${process.env.NEXT_PUBLIC_PHONE}`}
            className="text-sm font-body text-text-muted hover:text-text transition-colors"
          >
            {process.env.NEXT_PUBLIC_PHONE}
          </a>
          <Button size="sm" onClick={() => open()}>
            Custom Order
          </Button>
        </div>
      )}
    </header>
  );
}
