import Image from 'next/image';

const galleryImages = [
  {
    id: 1,
    title: 'მყუდრო მისაღები ოთახი',
    category: 'ინტერიერი',
    url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000&auto=format&fit=crop',
    span: 'col-span-1 md:col-span-2 row-span-2',
  },
  {
    id: 2,
    title: 'მთავარი საძინებელი',
    category: 'საძინებელი',
    url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=800&auto=format&fit=crop',
    span: 'col-span-1',
  },
  {
    id: 3,
    title: 'თანამედროვე სამზარეულო',
    category: 'სამზარეულო',
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop',
    span: 'col-span-1',
  },
  {
    id: 4,
    title: 'აბაზანა და სველი წერტილი',
    category: 'აბაზანა',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop',
    span: 'col-span-1',
  },
  {
    id: 5,
    title: 'ხედი აივნიდან',
    category: 'ექსტერიერი / ხედი',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop',
    span: 'col-span-1 md:col-span-2',
  },
];

export default function HeroGallery() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">გალერეა</span>
          <h2 className="text-3xl font-bold text-gray-900 mt-1 mb-2">
            დაათვალიერეთ ჩვენი აპარტამენტი
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[220px]">
          {galleryImages.map((img) => (
            <div 
              key={img.id} 
              className={`relative group overflow-hidden rounded-2xl shadow-sm cursor-pointer ${img.span}`}
            >
              <Image
                src={img.url}
                alt={img.title}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <span className="text-xs font-medium text-amber-400 uppercase tracking-wide mb-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {img.category}
                </span>
                <h3 className="text-white text-base font-semibold translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                  {img.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}