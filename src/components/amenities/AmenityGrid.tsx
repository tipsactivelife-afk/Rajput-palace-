const ICONS: Record<string, string> = {
  "Comfortable Rooms": "bed",
  "Wi-Fi": "wifi",
  "Air Conditioning": "snow",
  "Room Service": "bell",
  Housekeeping: "sparkle",
  Parking: "car",
  "Hot Water": "drop",
  Television: "tv",
  "Family Friendly": "family",
  "24/7 Support": "clock",
};

function Icon({ name }: { name: string }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none" as const, "aria-hidden": true };
  switch (name) {
    case "wifi":
      return <svg {...common}><path d="M2 8.5a16 16 0 0 1 20 0M5.5 12a11 11 0 0 1 13 0M9 15.5a6 6 0 0 1 6 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="12" cy="19" r="1.2" fill="currentColor"/></svg>;
    case "snow":
      return <svg {...common}><path d="M12 2v20M4.5 6.5l15 11M19.5 6.5l-15 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;
    case "bed":
      return <svg {...common}><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 18v2M21 18v2M3 12V8a2 2 0 0 1 2-2h4v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case "bell":
      return <svg {...common}><path d="M4 18h16l-1.5-2V11a6.5 6.5 0 0 0-13 0v5L4 18Zm6 3a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case "sparkle":
      return <svg {...common}><path d="M12 3l1.6 4.9L18.5 9l-4.9 1.6L12 15.5l-1.6-4.9L5.5 9l4.9-1.6L12 3ZM19 15l.8 2.4L22 18l-2.2.6L19 21l-.8-2.4L16 18l2.2-.6L19 15Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>;
    case "car":
      return <svg {...common}><path d="M4 16V11l2-4h12l2 4v5M4 16h16M4 16v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2M17 16v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case "drop":
      return <svg {...common}><path d="M12 3s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>;
    case "tv":
      return <svg {...common}><rect x="3" y="5" width="18" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><path d="M9 21h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;
    case "family":
      return <svg {...common}><circle cx="8" cy="7" r="2.2" stroke="currentColor" strokeWidth="1.5"/><circle cx="16" cy="7" r="2.2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 20v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2M13 20v-1a4 4 0 0 1 4-4h1a3 3 0 0 1 3 3v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
    case "clock":
      return <svg {...common}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/><path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;
    default:
      return <svg {...common}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/></svg>;
  }
}

export function AmenityGrid({ amenities }: { amenities: string[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
      {amenities.map((amenity) => (
        <div
          key={amenity}
          className="flex flex-col items-center text-center gap-3 rounded-2xl border border-stone bg-white px-4 py-7 hover:border-gold transition-colors"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-stone/60 text-maroon">
            <Icon name={ICONS[amenity] ?? "clock"} />
          </span>
          <span className="text-sm font-label text-charcoal">{amenity}</span>
        </div>
      ))}
    </div>
  );
                                }
