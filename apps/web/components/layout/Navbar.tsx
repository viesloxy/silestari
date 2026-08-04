"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/jelajahi", label: "Jelajahi" },
  { href: "/tambah", label: "Tambah Kata" },
  { href: "/tanya", label: "Tanya" },
  { href: "/statistik", label: "Statistik" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        scrolled || isOpen
          ? "bg-white/95 backdrop-blur-md border-b border-sl-ink-100 shadow-lg"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3 animate-fade-in-left"
          aria-label="Si Lestari, halaman utama"
        >
          <div className="rounded-lg p-1 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
            <Image
              src="/brand/logo.svg"
              alt=""
              aria-hidden
              width={32}
              height={32}
              priority
              className="h-8 w-8"
            />
          </div>
          <span className="text-xl font-semibold tracking-tight text-sl-ink-900 transition-colors duration-200 group-hover:text-sl-kilau-600">
            Si Lestari
          </span>
          <span className="hidden animate-pulse-slow text-sl-ink-300 md:inline">
            |
          </span>
          <span className="hidden text-sm text-sl-ink-500 md:inline">
            Kamus Kolaboratif Bahasa Daerah
          </span>
        </Link>

        <nav
          aria-label="Navigasi utama"
          className="hidden animate-fade-in-right items-center gap-7 lg:flex"
        >
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative text-sm font-medium transition-colors duration-200",
                  active
                    ? "text-sl-kilau-700"
                    : "text-sl-ink-700 hover:text-sl-kilau-600",
                )}
              >
                {link.label}
                {active && (
                  <span
                    aria-hidden
                    className="absolute -bottom-1.5 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-sl-kilau-500"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex animate-fade-in-right items-center gap-3">
          <Link
            href="/tambah"
            className="btn-pill btn-pill-sm btn-pill-primary hidden sm:inline-flex"
          >
            Sumbang Kata
          </Link>
          <button
            type="button"
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sl-ink-100 bg-white/70 text-sl-ink-700 transition-all duration-200 hover:bg-sl-kilau-50 hover:text-sl-kilau-700 lg:hidden"
          >
            {isOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={cn(
          "overflow-hidden border-t border-sl-ink-100 bg-white/95 backdrop-blur-md transition-[max-height,opacity] duration-300 ease-out lg:hidden",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 border-transparent",
        )}
      >
        <nav
          aria-label="Navigasi mobile"
          className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6"
        >
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200",
                  active
                    ? "bg-sl-kilau-50 text-sl-kilau-700"
                    : "text-sl-ink-700 hover:bg-sl-kilau-50/60 hover:text-sl-kilau-700",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/tambah"
            className="btn-pill btn-pill-lg btn-pill-primary mt-2 w-full sm:hidden"
          >
            Sumbang Kata
          </Link>
        </nav>
      </div>
    </nav>
  );
}
