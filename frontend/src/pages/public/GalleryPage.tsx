import { PageFrame } from "./PageFrame";

export function GalleryPage() {
  return (
    <PageFrame
      description="Use this page for filterable photos and short videos tagged by event, campaign, and program so visual proof remains organized and searchable."
      eyebrow="Gallery"
      title="The visual system should reinforce trust, not distract from it."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div
            className="rounded-[28px] bg-gradient-to-br from-trust-700 to-trust-900 px-6 py-12 text-center text-sm font-semibold text-white"
            key={index}
          >
            Media asset {index + 1}
          </div>
        ))}
      </div>
    </PageFrame>
  );
}
