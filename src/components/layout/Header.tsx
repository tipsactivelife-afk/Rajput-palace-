"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms" },
  { href: "/amenities", label: "Amenities" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/location", label: "Location" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        // Always a solid-enough background so nav text/icons stay readable
        // over any hero image behind it — not just after scrolling.
        scrolled ? "bg-ivory/95 backdrop-blur shadow-[var(--shadow-soft)]" : "bg-ivory/90 backdrop-blur-sm",
      )}
    >
      <div className="container-px mx-auto flex h-16 max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 min-w-0">
          <Image
            src="/logo.png"
            alt="Rajput Palace"
            width={40}
            height={40}
            priority
            className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full"
          />
          <span className="flex items-baseline gap-2 min-w-0">
            <span className="font-display text-lg sm:text-xl md:text-2xl text-maroon truncate">
              Rajput Palace
            </span>
            <span className="hidden md:inline eyebrow text-charcoal-soft shrink-0">Ayodhya</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-label text-sm text-charcoal-soft hover:text-maroon transition-colors",
                pathname === link.href && "text-maroon",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/booking"
            className="inline-flex items-center rounded-full bg-maroon px-6 py-2.5 text-sm font-label font-medium text-ivory hover:bg-maroon-deep transition-colors"
          >
            Book Your Stay
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="lg:hidden inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-maroon/30 bg-ivory text-maroon shadow-sm"
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile drawer — anchored to the header's own height (h-16 = 4rem)
          instead of a hard-coded pixel value, and sized with 100dvh so it
          never shifts or leaves a gap when the mobile browser's address
          bar shows/hides while scrolling. */}
      <div
        className={cn(
          "lg:hidden fixed left-0 right-0 top-16 z-40 overflow-y-auto bg-ivory transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full pointer-events-none",
        )}
        style={{ height: "calc(100dvh - 4rem)" }}
      >
        <nav className="flex flex-col gap-1 p-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-lg px-4 py-3.5 text-lg font-display text-charcoal hover:bg-stone/60",
                pathname === link.href && "text-maroon bg-stone/50",
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/booking"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-maroon px-6 py-3.5 text-base font-label font-medium text-ivory"
          >
            Book Your Stay
          </Link>
        </nav>
      </div>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

