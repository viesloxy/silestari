"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        scrolled
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
              src="/brand/logo.png"
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
            className="btn-pill btn-pill-sm btn-pill-primary"
          >
            Sumbang Kata
          </Link>
        </div>
      </div>
    </nav>
  );
}
