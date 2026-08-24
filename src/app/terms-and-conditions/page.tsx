import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { hotelConfig } from "@/lib/hotel-config";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and Conditions for the Rajput Palace, Ayodhya website and booking inquiries.",
  alternates: { canonical: "/terms-and-conditions" },
};

export default function TermsPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container-px mx-auto max-w-3xl">
        <SectionHeading eyebrow="Legal" title="Terms &amp; Conditions" />
        <div className="mt-10 space-y-6 text-sm leading-relaxed text-charcoal-soft">
          <section>
            <h2 className="font-display text-lg text-charcoal">Booking Inquiries</h2>
            <p className="mt-2">
              Submitting the booking form on this website sends a reservation inquiry to{" "}
              {hotelConfig.name}. It does not guarantee a confirmed booking or process any payment.
              Our team will contact you directly to confirm availability and finalise your stay.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg text-charcoal">Pricing</h2>
            <p className="mt-2">
              Prices shown on this website, where displayed, are indicative and subject to
              confirmation. Where a room shows &ldquo;Price on request&rdquo;, final pricing will
              be shared directly by our team.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg text-charcoal">Website Use</h2>
            <p className="mt-2">
              Content on this website is provided for general information about {hotelConfig.name}.
              We aim to keep it accurate and up to date, and update it as hotel details are confirmed.
            </p>
          </section>
          <p className="text-xs text-charcoal-soft/70">
            This is a template. Please have it reviewed by a qualified professional and adapted to
            your hotel&rsquo;s specific cancellation, check-in/check-out and payment policies before
            publishing.
          </p>
        </div>
      </div>
    </div>
  );
}
