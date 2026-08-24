import { getTelHref, isPhoneConfigured } from "@/lib/hotel-config";
import { cn } from "@/lib/utils";

interface CallButtonProps {
  className?: string;
  variant?: "solid" | "outline" | "ghost";
  full?: boolean;
}

export function CallButton({ className, variant = "outline", full }: CallButtonProps) {
  const href = getTelHref();

  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-label font-medium transition-colors duration-200";
  const styles = {
    solid: "bg-maroon text-ivory hover:bg-maroon-deep",
    outline: "border border-maroon text-maroon hover:bg-maroon hover:text-ivory",
    ghost: "text-charcoal hover:text-maroon",
  } as const;

  if (!isPhoneConfigured || !href) {
    return (
      <span
        className={cn(base, styles[variant], full && "w-full", "cursor-not-allowed opacity-50", className)}
        title="Phone number to be added by the hotel"
        aria-disabled="true"
      >
        <PhoneIcon /> Call Now
      </span>
    );
  }

  return (
    <a href={href} className={cn(base, styles[variant], full && "w-full", className)}>
      <PhoneIcon /> Call Now
    </a>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .5 1 1V20c0 .6-.4 1-1 1C10.4 21 3 13.6 3 4.5c0-.6.4-1 1-1h3.5c.5 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.3 0 .7-.2 1L6.6 10.8z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
