export default function Initiatives() {
  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-manrope font-bold text-primary mb-12 text-center">Ramani Foundation Initiatives in Udaipur</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-border">
          <img src="/images/icon-education.png" alt="Education icon" className="w-16 h-16 mb-4" />
          <h2 className="text-2xl font-manrope font-bold text-accent mb-4">Udaipur Education Initiative</h2>
          <p className="font-publicSans text-gray-700">Supporting schools in rural Udaipur areas with learning materials, teacher training, and digital education programs to bridge the urban-rural education gap.</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm border border-border">
          <img src="/images/icon-health.png" alt="Health icon" className="w-16 h-16 mb-4" />
          <h2 className="text-2xl font-manrope font-bold text-accent mb-4">Healthcare Access Program</h2>
          <p className="font-publicSans text-gray-700">Mobile health clinics serving Udaipur's tribal communities, maternal care programs, and partnerships with local hospitals to improve healthcare outcomes.</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm border border-border">
          <img src="/images/icon-livelihood.png" alt="Livelihood icon" className="w-16 h-16 mb-4" />
          <h2 className="text-2xl font-manrope font-bold text-accent mb-4">Women's Economic Empowerment</h2>
          <p className="font-publicSans text-gray-700">Skill development programs for Udaipur women, microfinance support, and handicraft marketing initiatives to promote financial independence.</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm border border-border">
          <img src="/images/icon-environment.png" alt="Environment icon" className="w-16 h-16 mb-4" />
          <h2 className="text-2xl font-manrope font-bold text-accent mb-4">Lake Pichola Conservation</h2>
          <p className="font-publicSans text-gray-700">Environmental education programs, community clean-up drives, and sustainable tourism initiatives to protect Udaipur's iconic water bodies and natural heritage.</p>
        </div>
      </div>
    </div>
  );
}
