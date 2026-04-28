export default function Initiatives() {
  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-manrope font-bold text-primary mb-12 text-center">Our Initiatives</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-border">
          <img src="/images/icon-education.png" alt="Education icon" className="w-16 h-16 mb-4" />
          <h2 className="text-2xl font-manrope font-bold text-accent mb-4">Project Pahal</h2>
          <p className="font-publicSans text-gray-700">Providing comprehensive educational support in underprivileged areas through local SPOCs, learning centers, study material support, and weekly mentoring workshops.</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm border border-border">
          <img src="/images/icon-health.png" alt="Health icon" className="w-16 h-16 mb-4" />
          <h2 className="text-2xl font-manrope font-bold text-accent mb-4">Project Udaan</h2>
          <p className="font-publicSans text-gray-700">Collaborating with NGOs, orphanages, old age homes, and local institutions through needs assessment, volunteer support, and joint impact activities.</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm border border-border">
          <img src="/images/icon-livelihood.png" alt="Livelihood icon" className="w-16 h-16 mb-4" />
          <h2 className="text-2xl font-manrope font-bold text-accent mb-4">Project Shakti</h2>
          <p className="font-publicSans text-gray-700">Empowering women through skill development, entrepreneurship support, wellness programs, and legal literacy initiatives that build confidence and self-reliance.</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm border border-border">
          <img src="/images/icon-environment.png" alt="Environment icon" className="w-16 h-16 mb-4" />
          <h2 className="text-2xl font-manrope font-bold text-accent mb-4">Project Prayaas</h2>
          <p className="font-publicSans text-gray-700">Strengthening infrastructure in bastis and villages with mobile health camps, water access, transport support, hygiene drives, and community-level basic facility improvements.</p>
        </div>
      </div>
    </div>
  );
}
