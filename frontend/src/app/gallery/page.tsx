export const dynamic = 'force-dynamic';
import { fetchGallery } from "@/lib/api";

export default async function Gallery() {
  const items = await fetchGallery();

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-manrope font-bold text-primary mb-12 text-center">Our Gallery</h1>
      {items.length === 0 ? (
        <p className="text-center text-gray-500 font-publicSans">No images in the gallery yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item: { id: number; title: string; image_url: string }) => (
            <div key={item.id} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`http://localhost:8000${item.image_url}`}
                alt={item.title}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <h3 className="text-white font-manrope font-bold">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
