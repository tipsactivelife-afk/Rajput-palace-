import Link from "next/link";
import { ImageFallback } from "@/components/ui/ImageFallback";
import { CallButton } from "@/components/ui/CallButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export function Hero({ heroImage }: { heroImage?: string | null }) {
  return (
    <section className="relative overflow-hidden bg-maroon-deep">
      <div className="absolute inset-0">
        <ImageFallback
          src={heroImage}
          alt="Rajput Palace, Ayodhya — hotel exterior at dusk"
          label="Rajput Palace, Ayodhya"
          className="h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep via-maroon-deep/70 to-maroon-deep/30" />
      </div>

      <div className="relative container-px mx-auto max-w-7xl min-h-[86vh] flex flex-col justify-end pb-16 pt-40 md:pt-56 md:pb-24">
        <span className="eyebrow text-gold-soft">Ayodhya, Uttar Pradesh</span>
        <h1 className="mt-4 font-display text-4xl leading-tight text-ivory sm:text-5xl md:text-6xl max-w-3xl">
          Rajput Palace
        </h1>
        <p className="mt-3 font-display text-xl md:text-2xl text-gold-soft max-w-2xl">
          Premium Stay in the Heart of Ayodhya
        </p>
        <p className="mt-5 max-w-xl text-sm md:text-base text-ivory/80 leading-relaxed">
          Experience comfort, warm hospitality and a peaceful stay while discovering
          the spiritual and cultural beauty of Ayodhya.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/booking"
            className="inline-flex items-center justify-center rounded-full bg-gold px-7 py-3.5 text-sm font-label font-medium text-maroon-deep hover:bg-gold-soft transition-colors"
          >
            Book Your Stay
          </Link>
          <Link
            href="/rooms"
            className="inline-flex items-center justify-center rounded-full border border-ivory/40 px-7 py-3.5 text-sm font-label font-medium text-ivory hover:bg-ivory/10 transition-colors"
          >
            Explore Rooms
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <CallButton variant="ghost" className="!text-ivory/90 !px-0 hover:!text-gold-soft" />
          <span className="text-ivory/30">•</span>
          <WhatsAppButton variant="ghost" className="!text-ivory/90 !px-0 hover:!text-gold-soft" />
        </div>
      </div>
    </section>
  );
}
