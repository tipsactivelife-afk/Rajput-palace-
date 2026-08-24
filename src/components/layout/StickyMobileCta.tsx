import Link from "next/link";
import { CallButton } from "@/components/ui/CallButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export function StickyMobileCta() {
  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-stone bg-white/95 backdrop-blur px-3 py-2.5"
      style={{ paddingBottom: "calc(0.625rem + env(safe-area-inset-bottom))" }}
    >
      <div className="grid grid-cols-3 gap-2">
        <CallButton variant="outline" full className="!px-2 !py-2.5 text-xs" />
        <WhatsAppButton variant="solid" full className="!px-2 !py-2.5 text-xs" />
        <Link
          href="/booking"
          className="inline-flex items-center justify-center rounded-full bg-gold px-2 py-2.5 text-xs font-label font-medium text-maroon-deep"
        >
          Book
        </Link>
      </div>
    </div>
  );
}

