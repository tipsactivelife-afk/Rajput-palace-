// Central, environment-driven configuration for Rajput Palace.
// Real phone/WhatsApp/email confirmed by the owner are set as the
// default fallback below, so the site works out of the box even before
// Vercel environment variables are configured. Setting the matching
// NEXT_PUBLIC_* env var always overrides the default, in case the
// number/email ever changes later.

function cleanEnv(value: string | undefined): string {
  return (value ?? "").trim();
}

// Owner-confirmed contact details (the same number is used for both
// phone calls and WhatsApp).
const DEFAULT_PHONE = "+91 84180 23310";
const DEFAULT_WHATSAPP = "919621742333";
const DEFAULT_EMAIL = "singhanil9730@gmail.com";

export const hotelConfig = {
  name: "Rajput Palace",
  city: "Ayodhya",
  state: "Uttar Pradesh",
  country: "India",
  address: "Near Sabji Mandi, Sapt Sagar Colony, Ayodhya, Uttar Pradesh, India",

  phone: cleanEnv(process.env.NEXT_PUBLIC_HOTEL_PHONE) || DEFAULT_PHONE,
  whatsapp: cleanEnv(process.env.NEXT_PUBLIC_HOTEL_WHATSAPP) || DEFAULT_WHATSAPP,
  email: cleanEnv(process.env.NEXT_PUBLIC_HOTEL_EMAIL) || DEFAULT_EMAIL,

  // Optional — falls back to a plain search link built from the address
  // so "Get Directions" always works, even before a dedicated Maps URL
  // is configured. No paid Google Maps API is required.
  googleMapsUrl: cleanEnv(process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL),

  siteUrl: cleanEnv(process.env.NEXT_PUBLIC_SITE_URL) || "https://rajputpalace-ayodhya.example.com",
};

export const isPhoneConfigured = hotelConfig.phone.length > 0;
export const isWhatsappConfigured = hotelConfig.whatsapp.length > 0;
export const isEmailConfigured = hotelConfig.email.length > 0;

export function getGoogleMapsUrl(): string {
  if (hotelConfig.googleMapsUrl) return hotelConfig.googleMapsUrl;
  const query = encodeURIComponent(hotelConfig.address);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function getTelHref(): string | null {
  if (!isPhoneConfigured) return null;
  return `tel:${hotelConfig.phone.replace(/[^\d+]/g, "")}`;
}

export function getWhatsAppHref(message?: string): string | null {
  if (!isWhatsappConfigured) return null;
  const digits = hotelConfig.whatsapp.replace(/[^\d]/g, "");
  const defaultMessage =
    "Hello Rajput Palace, I would like to enquire about room availability.";
  const text = encodeURIComponent(message ?? defaultMessage);
  return `https://wa.me/${digits}?text=${text}`;
}

export function getMailHref(): string | null {
  if (!isEmailConfigured) return null;
  return `mailto:${hotelConfig.email}`;
}
