import type { Testimonial } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Guest testimonials are never fabricated. When there are no real,
 * hotel-provided testimonials yet, this section renders nothing at all
 * rather than showing placeholder or invented quotes.
 */
export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null;

  return (
    <section className="py-20 md:py-28">
      <div className="container-px mx-auto max-w-7xl">
        <SectionHeading eyebrow="Guests" title="What our guests say" align="center" className="mx-auto" />
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <blockquote key={t.id} className="rounded-2xl bg-white p-7 shadow-[var(--shadow-card)]">
              <p className="text-sm text-charcoal-soft leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4 font-label text-sm text-maroon">
                — {t.guest_name}
                {t.location ? `, ${t.location}` : ""}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

