import Link from "next/link";
import { hotelConfig, isEmailConfigured, isPhoneConfigured, getTelHref, getMailHref } from "@/lib/hotel-config";

const EXPLORE_LINKS = [
  { href: "/rooms", label: "Rooms" },
  { href: "/amenities", label: "Amenities" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About Us" },
];

const INFO_LINKS = [
  { href: "/location", label: "Location" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
];

export function Footer() {
  const telHref = getTelHref();
  const mailHref = getMailHref();

  return (
    <footer className="bg-maroon-deep text-ivory">
      <div className="container-px mx-auto max-w-7xl py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <span className="font-display text-2xl">Rajput Palace</span>
          <p className="mt-3 text-sm text-ivory/70 leading-relaxed">{hotelConfig.address}</p>
        </div>

        <div>
          <h3 className="eyebrow text-gold-soft">Explore</h3>
          <ul className="mt-4 space-y-2">
            {EXPLORE_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-ivory/80 hover:text-ivory">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow text-gold-soft">Information</h3>
          <ul className="mt-4 space-y-2">
            {INFO_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-ivory/80 hover:text-ivory">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow text-gold-soft">Contact</h3>
          <ul className="mt-4 space-y-2 text-sm text-ivory/80">
            <li>
              {isPhoneConfigured && telHref ? (
                <a href={telHref} className="hover:text-ivory">
                  {hotelConfig.phone}
                </a>
              ) : (
                <span className="text-ivory/50">Phone coming soon</span>
              )}
            </li>
            <li>
              {isEmailConfigured && mailHref ? (
                <a href={mailHref} className="hover:text-ivory">
                  {hotelConfig.email}
                </a>
              ) : (
                <span className="text-ivory/50">Email coming soon</span>
              )}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container-px mx-auto max-w-7xl py-6 text-xs text-ivory/50 flex flex-col md:flex-row gap-2 md:justify-between">
          <span>© {new Date().getFullYear()} Rajput Palace, Ayodhya. All rights reserved.</span>
          <span>Sapt Sagar Colony, Near Sabji Mandi, Ayodhya, Uttar Pradesh</span>
        </div>
      </div>
    </footer>
  );
                                                                 }

