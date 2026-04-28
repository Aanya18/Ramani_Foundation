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
              Transforming lives through education, empowerment, and sustainable community development.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-100 leading-relaxed">
              Ramani Foundation works to uplift underprivileged communities through education, healthcare,
              women empowerment, and access to essential services in underserved areas.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <img
              src="/images/about-mission.jpg"
              alt="Our mission in action"
              className="w-full h-96 object-cover rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_0.8fr] items-start">
          <div className="space-y-8">
            <div className="rounded-[2rem] border border-slate-200/70 bg-white p-10 shadow-lg">
              <h2 className="text-3xl font-manrope font-bold text-foreground mb-4">Our Purpose</h2>
              <p className="text-slate-600 leading-relaxed">
                Our purpose is to create meaningful and lasting change through focused interventions in education,
                hygiene and nutrition, child participation, and skill and personality development.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  title: "Women Empowerment",
                  description: "Promoting education, rights awareness, and livelihood opportunities for women to achieve independence.",
                },
                {
                  title: "Essential Access",
                  description: "Expanding access to medical care, clean water, transportation, and other basic facilities in underserved areas.",
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
                To uplift underprivileged communities through education, healthcare, and empowerment; foster women
                empowerment through impactful schemes; and ensure access to core facilities in underserved regions.
              </p>
            </div>
            <div className="rounded-[2rem] bg-secondary/10 p-10 border border-secondary/20">
              <h3 className="text-2xl font-manrope font-bold text-secondary mb-4">Our Vision</h3>
              <p className="text-slate-700 leading-relaxed">
                Transforming lives through education, empowerment, and sustainable community development.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
