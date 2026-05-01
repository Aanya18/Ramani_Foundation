import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { Heart, BookOpen, Stethoscope, Droplets, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Donate — Ramani Foundation" },
      {
        name: "description",
        content:
          "Support Ramani Foundation. Your donation funds books, meals, medical camps and women empowerment programs.",
      },
      { property: "og:title", content: "Donate to Ramani Foundation" },
      {
        property: "og:description",
        content:
          "Fund education, healthcare and women empowerment for India's underserved communities.",
      },
    ],
  }),
  component: DonatePage,
});

const tiers = [
  { amt: 500, label: "Books for a child", icon: BookOpen, color: "var(--brand-blue)" },
  { amt: 1500, label: "Medical camp kit", icon: Stethoscope, color: "var(--brand-teal)" },
  { amt: 3000, label: "Women's skill workshop", icon: Heart, color: "var(--brand-magenta)" },
  { amt: 5000, label: "Clean water access", icon: Droplets, color: "var(--brand-orange)" },
];

function DonatePage() {
  const [selected, setSelected] = useState(1500);
  const [custom, setCustom] = useState("");
  const finalAmt = custom ? Number(custom) : selected;

  return (
    <>
      <Toaster richColors />
      <PageHero
        eyebrow="Donate"
        title="Fuel a future. Fund a smile."
        description="Every rupee goes directly to children's education, women's empowerment and community healthcare."
      />
      <section className="section-y">
        <div className="container-page grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Choose an impact</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {tiers.map((t) => (
                  <button
                    key={t.amt}
                    onClick={() => {
                      setSelected(t.amt);
                      setCustom("");
                    }}
                    className={`relative text-left p-5 rounded-2xl border-2 transition-all ${
                      selected === t.amt && !custom
                        ? "border-transparent shadow-elevated"
                        : "border-border bg-card hover:border-foreground/20"
                    }`}
                    style={
                      selected === t.amt && !custom
                        ? {
                            background: `linear-gradient(135deg, color-mix(in oklab, ${t.color} 12%, white), white)`,
                            borderColor: t.color,
                          }
                        : undefined
                    }
                  >
                    <div
                      className="size-10 rounded-lg grid place-items-center text-white"
                      style={{ background: t.color }}
                    >
                      <t.icon className="size-5" />
                    </div>
                    <div className="mt-3 text-2xl font-bold">₹{t.amt.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{t.label}</div>
                    {selected === t.amt && !custom && (
                      <div
                        className="absolute top-3 right-3 size-6 rounded-full grid place-items-center text-white"
                        style={{ background: t.color }}
                      >
                        <Check className="size-3.5" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Or enter a custom amount</h3>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                    ₹
                  </span>
                  <input
                    type="number"
                    min={100}
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    placeholder="2000"
                    className="w-full h-14 pl-9 pr-4 rounded-xl border-2 border-border focus:border-[var(--brand-blue)] focus:outline-none bg-card text-lg font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-2">
            <div className="sticky top-24 p-6 md:p-8 rounded-3xl bg-gradient-brand text-white shadow-elevated">
              <div className="text-xs font-bold tracking-wider uppercase opacity-80">
                Your contribution
              </div>
              <div className="mt-2 text-5xl font-bold">
                ₹{finalAmt ? finalAmt.toLocaleString() : 0}
              </div>
              <p className="mt-3 text-sm text-white/85">
                Goes directly to community projects with full transparency.
              </p>
              <Button
                size="lg"
                onClick={() => toast.success("Thank you! Payment integration coming soon.")}
                className="mt-6 w-full rounded-full bg-white text-[var(--brand-blue)] hover:bg-white/90 font-semibold"
              >
                Donate ₹{finalAmt ? finalAmt.toLocaleString() : 0} <Heart className="size-4" />
              </Button>
              <ul className="mt-6 space-y-2 text-sm text-white/90">
                {["100% direct to programs", "Transparent reporting", "Tax-saving receipt"].map(
                  (b) => (
                    <li key={b} className="flex gap-2">
                      <Check className="size-4" /> {b}
                    </li>
                  ),
                )}
              </ul>
              <div className="mt-6 pt-6 border-t border-white/20 text-xs text-white/80">
                Prefer to talk first?{" "}
                <Link to="/contact" className="underline font-semibold">
                  Contact us
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
