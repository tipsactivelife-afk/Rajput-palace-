import { SectionHeading } from "@/components/ui/SectionHeading";

const HIGHLIGHTS = [
  {
    title: "Prime Ayodhya Location",
    description: "Conveniently located near Sabji Mandi and Sapt Sagar Colony.",
  },
  {
    title: "Comfortable Stay",
    description: "Designed for relaxing after a day of exploring Ayodhya.",
  },
  {
    title: "Family Friendly",
    description: "A welcoming environment for families and travellers.",
  },
  {
    title: "Warm Hospitality",
    description: "A comfortable experience focused on guest satisfaction.",
  },
];

export function Highlights() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-px mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Why Rajput Palace"
          title="A stay built around your comfort"
          align="center"
          className="mx-auto"
        />

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-stone rounded-2xl overflow-hidden">
          {HIGHLIGHTS.map((item) => (
            <div key={item.title} className="bg-ivory p-8">
              <h3 className="font-display text-lg text-maroon">{item.title}</h3>
              <p className="mt-2 text-sm text-charcoal-soft leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

