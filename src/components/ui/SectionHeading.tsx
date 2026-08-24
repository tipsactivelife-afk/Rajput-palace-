import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  light?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  light,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span className={cn("eyebrow text-gold")}>{eyebrow}</span>
      ) : null}
      <h2
        className={cn(
          "mt-3 font-display text-3xl md:text-4xl",
          light ? "text-ivory" : "text-charcoal",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className={cn("mt-4 text-base leading-relaxed", light ? "text-ivory/80" : "text-charcoal-soft")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

