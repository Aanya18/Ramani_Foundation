export default function Initiatives() {
  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-manrope font-bold text-primary mb-12 text-center">Our Initiatives</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-border">
          <h2 className="text-2xl font-manrope font-bold text-accent mb-4">Education for All</h2>
          <p className="font-publicSans text-gray-700">Providing school supplies, scholarships, and building classrooms in underserved areas to ensure every child has access to quality education.</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm border border-border">
          <h2 className="text-2xl font-manrope font-bold text-accent mb-4">Community Health</h2>
          <p className="font-publicSans text-gray-700">Organizing free medical camps, distributing essential medicines, and promoting health awareness programs to improve overall community well-being.</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm border border-border">
          <h2 className="text-2xl font-manrope font-bold text-accent mb-4">Sustainable Livelihoods</h2>
          <p className="font-publicSans text-gray-700">Offering vocational training and micro-grants to empower individuals to start small businesses and achieve financial independence.</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm border border-border">
          <h2 className="text-2xl font-manrope font-bold text-accent mb-4">Environmental Conservation</h2>
          <p className="font-publicSans text-gray-700">Leading tree planting drives, promoting waste management, and educating communities on sustainable environmental practices.</p>
        </div>
      </div>
    </div>
  );
}
