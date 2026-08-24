"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageFallbackProps {
  src?: string | null;
  alt: string;
  className?: string;
  archTop?: boolean;
  label?: string;
}

/**
 * Renders a real photo when `src` is provided and loads successfully.
 * Otherwise (missing URL, broken link, or still-placeholder demo data)
 * it renders a premium gradient placeholder instead of a broken-image
 * icon — so the hotel owner can safely swap in real photography later
 * without anything ever looking unfinished in the meantime.
 */
export function ImageFallback({ src, alt, className, archTop, label }: ImageFallbackProps) {
  const [errored, setErrored] = useState(false);
  const showPlaceholder = !src || errored;

  if (showPlaceholder) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-maroon via-maroon-soft to-gold/40",
          archTop && "arch-top",
          className,
        )}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(247,241,230,0.15) 0px, rgba(247,241,230,0.15) 1px, transparent 1px, transparent 14px)",
          }}
        />
        <div className="relative text-center px-4">
          <span className="eyebrow block text-ivory/80">Image coming soon</span>
          {label ? (
            <span className="mt-1 block font-display text-ivory text-sm md:text-base">
              {label}
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  // Plain <img> is intentional here: Supabase Storage image domains are
  // not known ahead of time (they vary per hotel-owner project), and this
  // component needs a live onError handler to swap in the placeholder —
  // both are simpler with a standard <img>. Swap to next/image once a
  // fixed Storage domain is configured in next.config.ts.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setErrored(true)}
      className={cn("object-cover", archTop && "arch-top", className)}
    />
  );
}

