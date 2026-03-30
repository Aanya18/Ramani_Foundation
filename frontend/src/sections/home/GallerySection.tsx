import { Container } from "../../components/ui/Container";
import { SectionHeading } from "../../components/ui/SectionHeading";

export function GallerySection() {
  const blocks = [
    "Learning session in community center",
    "Women-led training workshop",
    "Volunteer-driven awareness drive",
    "Student scholarship orientation",
    "Health camp registration desk",
  ];

  return (
    <section className="section-space">
      <Container>
        <SectionHeading
          eyebrow="Gallery"
          title="Visual proof should feel warm, documentary, and close to the work."
          description="The gallery preview keeps the homepage alive while still matching the serious, premium tone of the foundation."
        />
        <div className="mt-10 grid auto-rows-[170px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {blocks.map((item, index) => (
            <div
              className={`rounded-[28px] bg-gradient-to-br from-trust-700 to-trust-900 p-6 text-white ${
                index === 0 || index === 3 ? "lg:row-span-2" : ""
              }`}
              key={item}
            >
              <p className="text-sm font-semibold text-white/70">Gallery preview</p>
              <p className="mt-4 max-w-[12rem] font-display text-2xl">{item}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
