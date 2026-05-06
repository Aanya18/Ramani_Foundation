"use client";

import { useEffect, useMemo, useState } from "react";

import { PageHero } from "@/components/PageHero";
import { api, getImageUrl } from "@/lib/api";

interface GalleryImage {
  id: string;
  image_url: string;
  image_filename: string;
  order: number;
}

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  images: GalleryImage[];
  project_id?: string;
  project_name?: string;
  event_id?: string;
  event_title?: string;
  created_at: string;
}

const cats = ["All", "PAHAL", "UDAAN", "SHAKTI", "PRAYAAS"] as const;

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState<(typeof cats)[number]>("All");
  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .getGallery()
      .then((result) => {
        if (active) setItems(result as GalleryItem[]);
      })
      .catch((error) => {
        console.error("Failed to load gallery", error);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const visible = useMemo(() => {
    const allImages = items.flatMap((item) => {
      if (item.images?.length) {
        return item.images.map((img) => ({
          src: getImageUrl(img.image_url),
          title: item.title,
          description: item.description,
          projectName: item.project_name || "",
        }));
      }

      if (item.image_url) {
        return [
          {
            src: getImageUrl(item.image_url),
            title: item.title,
            description: item.description,
            projectName: item.project_name || "",
          },
        ];
      }

      return [];
    });

    return allImages
      .map((img, idx) => {
        let span = "";
        if (idx % 7 === 0) span = "md:col-span-2 md:row-span-2";
        else if (idx % 7 === 3) span = "md:row-span-2";

        const projectNameUpper = (img.projectName || "").toUpperCase();
        const titleUpper = (img.title || "").toUpperCase();
        const cat =
          projectNameUpper.includes("PAHAL") || titleUpper.includes("PAHAL")
            ? "PAHAL"
            : projectNameUpper.includes("UDAAN") || titleUpper.includes("UDAAN")
              ? "UDAAN"
              : projectNameUpper.includes("SHAKTI") || titleUpper.includes("SHAKTI")
                ? "SHAKTI"
                : projectNameUpper.includes("PRAYAAS") || titleUpper.includes("PRAYAAS")
                  ? "PRAYAAS"
                  : "All";

        return {
          src: img.src,
          cat,
          title: img.title,
          span,
        };
      })
      .filter((i) => filter === "All" || i.cat === filter);
  }, [filter, items]);

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

          {loading ? (
            <div className="text-center text-muted-foreground py-16">Loading gallery...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[180px] md:auto-rows-[220px] gap-3 md:gap-4">
              {visible.map((it, idx) => (
                <button
                  key={idx}
                  onClick={() => setOpen(it.src ?? null)}
                  className={`group relative overflow-hidden rounded-2xl ${it.span} bg-muted shadow-soft hover:shadow-elevated transition-all`}
                >
                  {it.src ? (
                    <img
                      src={it.src}
                      alt={it.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : null}
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
          )}
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
