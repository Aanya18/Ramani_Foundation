export default function About() {
  return (
    <div className="bg-background min-h-screen">
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-white/90">
              About Us
            </span>
            <h1 className="mt-8 text-4xl font-manrope font-extrabold leading-tight sm:text-5xl">
              Built to deliver meaningful outcomes for families and communities.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-100 leading-relaxed">
              Ramani Foundation partners with caregivers, educators, and health professionals to create long-term, evidence-driven programs that support early childhood development, health, and local economic resilience.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_0.8fr] items-start">
          <div className="space-y-8">
            <div className="rounded-[2rem] border border-slate-200/70 bg-white p-10 shadow-lg">
              <h2 className="text-3xl font-manrope font-bold text-foreground mb-4">Our Purpose</h2>
              <p className="text-slate-600 leading-relaxed">
                We work where the need is greatest, creating supportive systems for prenatal care, early education, and community-led leadership training.
                Every program is designed to accelerate opportunity in the first five years of life and strengthen family capacity for the long term.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  title: "Community Leadership",
                  description: "Empowering local partners to shape their own development journey.",
                },
                {
                  title: "Health & Nutrition",
                  description: "Supporting the earliest stages of growth with high-impact care and screenings.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-[1.75rem] bg-white border border-slate-200 p-8 shadow-sm">
                  <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] bg-primary/10 p-10 border border-primary/20">
              <h3 className="text-2xl font-manrope font-bold text-primary mb-4">Our Mission</h3>
              <p className="text-slate-700 leading-relaxed">
                To empower marginalized communities through holistic initiatives that promote self-reliance, education, and well-being.
              </p>
            </div>
            <div className="rounded-[2rem] bg-secondary/10 p-10 border border-secondary/20">
              <h3 className="text-2xl font-manrope font-bold text-secondary mb-4">Our Vision</h3>
              <p className="text-slate-700 leading-relaxed">
                A society where every child can reach their full potential, and every family has the support they need to build a brighter future.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
