export default function Stories() {
  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-manrope font-bold text-primary mb-12 text-center">Impact Stories</h1>
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Story 1 */}
        <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden md:flex">
          <div className="md:w-1/3 bg-gray-200 h-64 md:h-auto relative">
             <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-manrope font-bold opacity-50">Impact Image</span>
             </div>
          </div>
          <div className="p-8 md:w-2/3 flex flex-col justify-center">
            <h2 className="text-2xl font-manrope font-bold text-primary mb-4">A Brighter Future for Amina</h2>
            <p className="font-publicSans text-gray-700 mb-4">
              Amina, a 12-year-old girl from a remote village, used to walk 5 miles every day just to fetch water. Through our recent borehole drilling initiative, her community now has access to clean drinking water right in their village.
            </p>
            <p className="font-publicSans text-gray-700">
              &quot;I can finally spend more time reading my books and going to school,&quot; she says with a bright smile. Thanks to our donors, Amina&apos;s future is looking brighter than ever.
            </p>
          </div>
        </div>

        {/* Story 2 */}
        <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden md:flex flex-row-reverse">
          <div className="md:w-1/3 bg-gray-200 h-64 md:h-auto relative">
             <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-manrope font-bold opacity-50">Impact Image</span>
             </div>
          </div>
          <div className="p-8 md:w-2/3 flex flex-col justify-center">
            <h2 className="text-2xl font-manrope font-bold text-primary mb-4">Rebuilding After the Floods</h2>
            <p className="font-publicSans text-gray-700 mb-4">
              When devastating floods swept through the coastal region last year, hundreds of families lost their homes. Ramani Foundation quickly mobilized volunteers to distribute emergency relief kits.
            </p>
            <p className="font-publicSans text-gray-700">
              Today, we are working with local leaders to rebuild sustainable, flood-resistant housing for 50 families. It is a slow process, but the resilience of the community is truly inspiring.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
