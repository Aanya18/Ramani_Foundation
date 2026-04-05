import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20 px-4 text-center">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-6xl font-manrope font-bold mb-6">Empowering Communities, Changing Lives.</h1>
          <p className="text-lg md:text-xl font-publicSans mb-8 max-w-2xl mx-auto">
            Join the Ramani Foundation in our mission to provide education, healthcare, and sustainable development to those who need it most.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/donate">
              <Button className="bg-accent text-white hover:bg-accent/90" size="lg">Donate Now</Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="text-primary hover:bg-white/10" size="lg">Learn More</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-manrope font-bold text-primary mb-12">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-sm border">
              <h3 className="text-4xl font-bold text-accent mb-2">50k+</h3>
              <p className="text-gray-600 font-publicSans">Lives Touched</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm border">
              <h3 className="text-4xl font-bold text-accent mb-2">120</h3>
              <p className="text-gray-600 font-publicSans">Active Projects</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm border">
              <h3 className="text-4xl font-bold text-accent mb-2">15</h3>
              <p className="text-gray-600 font-publicSans">Communities Served</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-primary/5 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-manrope font-bold text-primary mb-6">Become a Volunteer</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto font-publicSans">
            We are always looking for passionate individuals to join our cause. Make a real difference in your community today.
          </p>
          <Link href="/contact">
            <Button className="bg-primary text-white hover:bg-primary/90" size="lg">Join Us Today</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
