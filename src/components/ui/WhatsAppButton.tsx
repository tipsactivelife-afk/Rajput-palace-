import { getWhatsAppHref, isWhatsappConfigured } from "@/lib/hotel-config";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  className?: string;
  variant?: "solid" | "outline" | "ghost";
  full?: boolean;
  message?: string;
  label?: string;
}

export function WhatsAppButton({
  className,
  variant = "solid",
  full,
  message,
  label = "WhatsApp",
}: WhatsAppButtonProps) {
  const href = getWhatsAppHref(message);

  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-label font-medium transition-colors duration-200";
  const styles = {
    solid: "bg-[#25913f] text-white hover:bg-[#1f7a35]",
    outline: "border border-[#25913f] text-[#1f7a35] hover:bg-[#25913f] hover:text-white",
    ghost: "text-charcoal hover:text-[#1f7a35]",
  } as const;

  if (!isWhatsappConfigured || !href) {
    return (
      <span
        className={cn(base, styles[variant], full && "w-full", "cursor-not-allowed opacity-50", className)}
        title="WhatsApp number to be added by the hotel"
        aria-disabled="true"
      >
        <WhatsAppIcon /> {label}
      </span>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cn(base, styles[variant], full && "w-full", className)}>
      <WhatsAppIcon /> {label}
    </a>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.2a8.1 8.1 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.2.2-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.4c.1-.2.2-.3.2-.5.1-.2 0-.4 0-.5L9.3 8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s1 2.5 1.1 2.6c.1.2 2 3 4.7 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  );
}

