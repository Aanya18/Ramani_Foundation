type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description: string;
  align?: "left" | "center";
  invert?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  invert = false,
}: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto text-center" : "";
  const titleClass = invert ? "text-white" : "text-ink";
  const descriptionClass = invert ? "text-white/75" : "text-ink/75";
  const eyebrowClass = invert
    ? "border-white/20 bg-white/10 text-white"
    : "border-trust-100 bg-white/80 text-trust-700";

  return (
    <div className={`max-w-3xl ${alignment}`}>
      {eyebrow ? <span className={`eyebrow ${eyebrowClass}`}>{eyebrow}</span> : null}
      <h2
        className={`mt-5 max-w-3xl font-display text-[2rem] font-semibold leading-[1.12] sm:text-[2.5rem] ${titleClass}`}
      >
        {title}
      </h2>
      <p className={`mt-5 max-w-2xl text-[15px] leading-8 sm:text-lg ${descriptionClass}`}>
        {description}
      </p>
    </div>
  );
}
