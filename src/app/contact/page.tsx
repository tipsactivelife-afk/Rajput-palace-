import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactSection } from "@/components/contact/ContactSection";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Rajput Palace, Ayodhya — address, phone, email and WhatsApp.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container-px mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Contact"
          title="Get in touch"
          description="For availability, directions or any questions about your stay, reach out to us directly."
        />
        <div className="mt-12">
          <ContactSection />
        </div>
      </div>
    </div>
  );
}
