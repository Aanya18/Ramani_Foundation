export default function Stories() {
  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-manrope font-bold text-primary mb-12 text-center">Udaipur Impact Stories</h1>
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Story 1 */}
        <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden md:flex">
          <div className="md:w-1/3 bg-gray-200 h-64 md:h-auto relative">
            <img
              src="/images/story-amina.jpg"
              alt="Amina with clean water access"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-8 md:w-2/3 flex flex-col justify-center">
            <h2 className="text-2xl font-manrope font-bold text-primary mb-4">Priya's Journey from Udaipur Village</h2>
            <p className="font-publicSans text-gray-700 mb-4">
              Priya, a 14-year-old girl from a tribal village near Udaipur, dreamed of becoming a doctor but lacked access to quality education. Through Ramani Foundation's scholarship program, she now attends a well-equipped school in the city.
            </p>
            <p className="font-publicSans text-gray-700">
              &quot;The foundation not only provides my education but also supports my family with healthcare and nutrition,&quot; she shares. Today, Priya is excelling in her studies and inspiring other girls in her community.
            </p>
          </div>
        </div>

        {/* Story 2 */}
        <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden md:flex flex-row-reverse">
          <div className="md:w-1/3 bg-gray-200 h-64 md:h-auto relative">
            <img
              src="/images/story-floods.jpg"
              alt="Community rebuilding after floods"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-8 md:w-2/3 flex flex-col justify-center">
            <h2 className="text-2xl font-manrope font-bold text-primary mb-4">Empowering Udaipur's Artisan Community</h2>
            <p className="font-publicSans text-gray-700 mb-4">
              Rajesh, a traditional craftsman from Udaipur's old city, struggled to sell his handmade jewelry due to lack of market access. Ramani Foundation's artisan support program connected him with urban markets and provided design training.
            </p>
            <p className="font-publicSans text-gray-700">
              Now, Rajesh not only sustains his family but also trains young apprentices, preserving Udaipur's rich craft heritage. His story represents how we're building sustainable livelihoods across the city.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
