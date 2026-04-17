export const dynamic = 'force-dynamic';
import { fetchGallery, mediaUrl, type GalleryItem } from "@/lib/api";

export default async function Gallery({ searchParams }: { searchParams: { event?: string } }) {
  const items: GalleryItem[] = await fetchGallery().catch(() => []);

  // Group items by event_id
  const generalImages = items.filter((item) => !item.event_id);
  const groupedByEvent = items.reduce<Record<string, { title: string; items: GalleryItem[] }>>((acc, item) => {
    if (item.event_id) {
      const eventKey = String(item.event_id);
      if (!acc[eventKey]) {
        acc[eventKey] = { title: item.event_title || 'Unknown Event', items: [] };
      }
      acc[eventKey].items.push(item);
    }
    return acc;
  }, {});

  const filterEventId = searchParams.event;

  return (
    <div className="bg-background min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-primary to-secondary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-manrope font-extrabold mb-4">Our Impact Gallery</h1>
            <p className="text-lg md:text-xl font-publicSans text-white/85 leading-relaxed">
              A visual journey of our efforts, community gatherings, and the smiles we have helped create.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-16 px-4 lg:px-8">
        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-manrope font-bold text-foreground mb-4">No images available yet.</h3>
            <p className="text-gray-500 font-publicSans">We are currently gathering moments to share with you.</p>
          </div>
        ) : (
          <div className="space-y-20">
            {/* If a specific event is selected, just show that event. Otherwise show all groups. */}
            {filterEventId && groupedByEvent[filterEventId] ? (
              <GallerySection title={groupedByEvent[filterEventId].title} items={groupedByEvent[filterEventId].items} />
            ) : (
              <>
                {/* General / Uncategorized Images */}
                {generalImages.length > 0 && (
                  <GallerySection title="General Initiatives" items={generalImages} />
                )}

                {/* Event-specific Images */}
                {Object.values(groupedByEvent).map((group, idx) => (
                  <GallerySection key={idx} title={group.title} items={group.items} />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function GallerySection({ title, items }: { title: string, items: GalleryItem[] }) {
  return (
    <div className="space-y-6">
      <div className="border-b-2 border-primary/20 pb-4 mb-8">
        <h2 className="text-3xl font-manrope font-bold text-foreground inline-block relative">
          {title}
          <span className="absolute bottom-[-18px] left-0 w-1/2 h-1 bg-accent rounded-full"></span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.id} className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaUrl(item.image_url)}
              alt={item.title}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A2521]/90 via-[#1A2521]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
              <h3 className="text-white font-manrope font-bold text-lg leading-tight translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
              {item.event_title && (
                 <span className="text-accent text-xs font-publicSans font-bold mt-2 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {item.event_title}
                 </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
