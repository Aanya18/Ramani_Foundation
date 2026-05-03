import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { api, getImageUrl } from "@/lib/api";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Ramani Foundation" },
      {
        name: "description",
        content:
          "Moments from the field — children, women, and communities Ramani Foundation works with across PAHAL, UDAAN, SHAKTI and PRAYAAS.",
      },
      { property: "og:title", content: "Gallery — Ramani Foundation" },
      {
        property: "og:description",
        content: "Moments from our work in education, women empowerment and community care.",
      },
    ],
  }),
  loader: async () => {
    const items = await api.getGallery();
    return { items };
  },
  component: GalleryPage,
});

const cats = ["All", "PAHAL", "UDAAN", "SHAKTI", "PRAYAAS"] as const;

function GalleryPage() {
  const { items } = Route.useLoaderData();
  const [filter, setFilter] = useState<(typeof cats)[number]>("All");
  const [open, setOpen] = useState<string | null>(null);
  const visible = items
    .map((item, idx) => {
      // Create some visual variety with spans
      let span = "";
      if (idx % 7 === 0) span = "md:col-span-2 md:row-span-2";
      else if (idx % 7 === 3) span = "md:row-span-2";

      return {
        src: getImageUrl(item.image_url),
        cat: item.title.includes("PAHAL") ? "PAHAL" :
             item.title.includes("UDAAN") ? "UDAAN" :
             item.title.includes("SHAKTI") ? "SHAKTI" :
             item.title.includes("PRAYAAS") ? "PRAYAAS" : "All",
        title: item.title,
        span
      };
    })
    .filter((i) => filter === "All" || i.cat === filter);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Moments from the field"
        description="Faces, smiles and milestones from across our projects."
      />

      <section className="section-y">
        <div className="container-page">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border ${
                  filter === c
                    ? "bg-gradient-brand text-white border-transparent shadow-soft"
                    : "bg-card text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[180px] md:auto-rows-[220px] gap-3 md:gap-4">
            {visible.map((it, idx) => (
              <button
                key={idx}
                onClick={() => setOpen(it.src ?? null)}
                className={`group relative overflow-hidden rounded-2xl ${it.span} bg-muted shadow-soft hover:shadow-elevated transition-all`}
              >
                <img
                  src={it.src}
                  alt={it.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-left translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                  <div className="text-[10px] font-bold tracking-wider uppercase text-[var(--brand-orange)]">
                    {it.cat}
                  </div>
                  <div className="text-white text-sm font-semibold">{it.title}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm grid place-items-center p-4 anim-rise"
          onClick={() => setOpen(null)}
        >
          <img
            src={open}
            alt=""
            className="max-w-[95vw] max-h-[90vh] object-contain rounded-2xl shadow-elevated"
          />
        </div>
      )}
    </>
  );
}
