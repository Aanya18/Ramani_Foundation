import { HeroSection } from "../../sections/home/HeroSection";
import { TrustStrip } from "../../sections/home/TrustStrip";
import { MissionSection } from "../../sections/home/MissionSection";
import { ProgramsSection } from "../../sections/home/ProgramsSection";
import { ImpactSection } from "../../sections/home/ImpactSection";
import { CampaignSection } from "../../sections/home/CampaignSection";
import { StoriesSection } from "../../sections/home/StoriesSection";
import { TeamSection } from "../../sections/home/TeamSection";
import { EventsSection } from "../../sections/home/EventsSection";
import { BlogSection } from "../../sections/home/BlogSection";
import { VolunteerSection } from "../../sections/home/VolunteerSection";
import { PartnersSection } from "../../sections/home/PartnersSection";
import { GallerySection } from "../../sections/home/GallerySection";
import { DonationBanner } from "../../sections/home/DonationBanner";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <MissionSection />
      <ProgramsSection />
      <ImpactSection />
      <CampaignSection />
      <StoriesSection />
      <TeamSection />
      <EventsSection />
      <BlogSection />
      <VolunteerSection />
      <PartnersSection />
      <GallerySection />
      <DonationBanner />
    </>
  );
}
