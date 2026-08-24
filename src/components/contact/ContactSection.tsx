import {
  getMailHref,
  getTelHref,
  hotelConfig,
  isEmailConfigured,
  isPhoneConfigured,
} from "@/lib/hotel-config";
import { CallButton } from "@/components/ui/CallButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export function ContactSection() {
  const telHref = getTelHref();
  const mailHref = getMailHref();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="rounded-2xl border border-stone bg-white p-6">
        <span className="eyebrow text-gold">Address</span>
        <p className="mt-2 text-sm text-charcoal leading-relaxed">{hotelConfig.address}</p>
      </div>

      <div className="rounded-2xl border border-stone bg-white p-6">
        <span className="eyebrow text-gold">Phone</span>
        <p className="mt-2 text-sm text-charcoal">
          {isPhoneConfigured && telHref ? (
            <a href={telHref} className="hover:text-maroon">
              {hotelConfig.phone}
            </a>
          ) : (
            <span className="text-charcoal-soft">To be added by the hotel</span>
          )}
        </p>
        <div className="mt-4">
          <CallButton variant="outline" />
        </div>
      </div>

      <div className="rounded-2xl border border-stone bg-white p-6">
        <span className="eyebrow text-gold">Email &amp; WhatsApp</span>
        <p className="mt-2 text-sm text-charcoal">
          {isEmailConfigured && mailHref ? (
            <a href={mailHref} className="hover:text-maroon">
              {hotelConfig.email}
            </a>
          ) : (
            <span className="text-charcoal-soft">To be added by the hotel</span>
          )}
        </p>
        <div className="mt-4">
          <WhatsAppButton variant="outline" />
        </div>
      </div>
    </div>
  );
}
