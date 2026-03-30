import { useParams } from "react-router-dom";
import { PageFrame } from "./PageFrame";

const titles: Record<string, string> = {
  privacy: "Privacy policy",
  terms: "Terms and conditions",
  "refund-policy": "Refund and cancellation policy",
  compliance: "80G, registration, and compliance",
  fcra: "FCRA information",
};

export function LegalPage() {
  const { slug = "privacy" } = useParams();

  return (
    <PageFrame
      ctaLabel="Contact Us"
      ctaTo="/contact"
      description="Legal and compliance pages should be admin-editable rich text pages with downloadable certificates and policy documents where needed."
      eyebrow="Legal"
      title={titles[slug] ?? "Legal information"}
    >
      <div className="panel p-8 text-sm leading-8 text-ink/70">
        This placeholder represents policy and compliance content loaded by slug from the
        backend CMS.
      </div>
    </PageFrame>
  );
}
