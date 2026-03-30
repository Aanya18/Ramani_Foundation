export type ProgramSummary = {
  slug: string;
  title: string;
  description: string;
  stat: string;
};

export type StorySummary = {
  name: string;
  role: string;
  quote: string;
};

export type EventSummary = {
  title: string;
  date: string;
  location: string;
  description: string;
};

export type BlogSummary = {
  category: string;
  title: string;
  excerpt: string;
};

export type PublicMetric = {
  label: string;
  value: string;
  note?: string | null;
};

export type PublicSettings = {
  organization_name: string;
  donation_currency: string;
  primary_phone: string;
  primary_email: string;
  hero_title: string;
  hero_subtitle: string;
  mission_title: string;
  mission_description: string;
  trust_items: string[];
  donation_presets: number[];
  trust_notes: string[];
  impact_stats: PublicMetric[];
};

export type MessageResponse = {
  message: string;
};

export type DonationInitiateRequest = {
  full_name: string;
  email: string;
  phone?: string;
  amount_paise: number;
  frequency: string;
  campaign_slug?: string;
  donor_note?: string;
  anonymous: boolean;
};

export type DonationInitiateResponse = {
  donation_id: string;
  reference: string;
  status: string;
  checkout_provider: string;
};

export type DashboardStat = {
  label: string;
  value: string;
};

export type DashboardResponse = {
  stats: DashboardStat[];
  pending_actions: string[];
};

export type DonationReport = {
  range: string;
  total_amount: number;
  transactions: number;
  top_campaign: string;
};

export type AdminProgram = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  focus_area: string;
  beneficiary_count: number;
  location_text?: string | null;
  status: string;
  is_featured: boolean;
  updated_at: string;
};

export type AdminBlog = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  status: string;
  is_featured: boolean;
  updated_at: string;
};

export type AdminEvent = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  event_type: string;
  city?: string | null;
  venue?: string | null;
  start_at?: string | null;
  status: string;
  is_featured: boolean;
  updated_at: string;
};

export type AdminStory = {
  id: string;
  story_title: string;
  slug: string;
  person_name: string;
  role_label: string;
  quote: string;
  summary: string;
  status: string;
  is_featured: boolean;
  updated_at: string;
};

export type AdminDonationRow = {
  id: string;
  donor_name: string;
  donor_email: string;
  amount_display: string;
  frequency: string;
  status: string;
  created_at: string;
};

export type AdminDonorRow = {
  id: string;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  status: string;
  created_at: string;
};

export type AdminVolunteerRow = {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  interest_area?: string | null;
  status: string;
  created_at: string;
};

export type AdminContactRow = {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  inquiry_type?: string | null;
  status: string;
  created_at: string;
};
