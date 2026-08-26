"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/rooms", label: "Rooms" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-ivory-dim flex flex-col lg:flex-row">
      <aside className="lg:w-60 lg:min-h-screen border-b lg:border-b-0 lg:border-r border-stone bg-white">
        <div className="p-5">
          <Link href="/admin" className="font-display text-lg text-maroon">
            Rajput Palace
          </Link>
          <p className="eyebrow text-charcoal-soft mt-0.5">Admin</p>
        </div>
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible px-3 pb-3 lg:pb-5">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-label text-charcoal-soft hover:bg-stone/50 hover:text-maroon transition-colors",
                pathname === item.href && "bg-maroon text-ivory hover:bg-maroon hover:text-ivory",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-3 pb-5 hidden lg:block">
          <button
            onClick={handleLogout}
            className="w-full rounded-lg border border-stone px-3.5 py-2.5 text-sm font-label text-charcoal-soft hover:text-maroon hover:border-maroon transition-colors"
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="flex justify-end lg:hidden mb-4">
          <button
            onClick={handleLogout}
            className="rounded-full border border-stone px-4 py-2 text-xs font-label text-charcoal-soft hover:text-maroon hover:border-maroon transition-colors"
          >
            Log out
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}

