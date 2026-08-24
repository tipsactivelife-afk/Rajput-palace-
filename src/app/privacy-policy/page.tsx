import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { hotelConfig } from "@/lib/hotel-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for the Rajput Palace, Ayodhya website.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container-px mx-auto max-w-3xl">
        <SectionHeading eyebrow="Legal" title="Privacy Policy" />
        <div className="mt-10 space-y-6 text-sm leading-relaxed text-charcoal-soft">
          <p>
            This Privacy Policy explains how {hotelConfig.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;)
            collects, uses and protects information submitted through this website, including the
            booking / reservation inquiry form.
          </p>
          <section>
            <h2 className="font-display text-lg text-charcoal">Information We Collect</h2>
            <p className="mt-2">
              When you submit a booking inquiry, we collect your name, phone number, email address,
              stay dates, number of guests/rooms and any special requests you choose to share.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg text-charcoal">How We Use Information</h2>
            <p className="mt-2">
              Information submitted is used solely to respond to your inquiry, confirm availability,
              and communicate with you about your stay. We do not sell your information to third parties.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg text-charcoal">Data Storage</h2>
            <p className="mt-2">
              Booking inquiries are stored securely in our database with access restricted to
              authorised hotel staff.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg text-charcoal">Contact</h2>
            <p className="mt-2">
              For questions about this policy or your data, please contact us using the details on
              our Contact page.
            </p>
          </section>
          <p className="text-xs text-charcoal-soft/70">
            This is a template policy. Please have it reviewed by a qualified professional before
            publishing, and update it to reflect your hotel&rsquo;s actual data practices.
          </p>
        </div>
      </div>
    </div>
  );
}
