export type Category = 'huile-essentielle' | 'huile-vegetale' | 'melange' | 'diffuseur' | 'coffret';
export type Usage = 'relaxation' | 'sante' | 'beaute' | 'energie' | 'digestion';

export type Product = {
  id: string;
  slug: string;
  name: string;
  short: string;
  description: string;
  benefits: string[];
  usage_tips: string;
  precautions: string | null;
  category: string;
  usage: string;
  price_fcfa: number | null;
  volume: string | null;
  image_url: string | null;
  in_stock: boolean;
  featured: boolean;
  published: boolean;
  sort: number;
};

export type Review = {
  id: string;
  name: string;
  city: string | null;
  product: string | null;
  rating: number;
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

export type RequestRow = {
  id: string;
  kind: 'consultation' | 'contact' | 'commande';
  name: string;
  phone: string | null;
  email: string | null;
  subject: string | null;
  message: string | null;
  consult_date: string | null;
  consult_time: string | null;
  consult_type: string | null;
  status: 'nouveau' | 'en_cours' | 'traite' | 'archive';
  admin_note: string | null;
  created_at: string;
};

export type TeamMember = { id: string; name: string; role: string; photo_url: string | null; published: boolean; sort: number };
export type Faq = { id: string; question: string; answer: string; published: boolean; sort: number };

export type Settings = {
  phone_cm: string;
  whatsapp_cm: string;
  phone_ca: string;
  whatsapp_ca: string;
  email: string;
  address: string;
  address_ca: string;
  hours: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  stat_satisfaction: string;
  stat_consultations: string;
  stat_clients: string;
};

export const CATEGORY_LABELS: Record<string, string> = {
  'huile-essentielle': 'Huiles essentielles',
  'huile-vegetale': 'Huiles végétales',
  melange: 'Mélanges',
  diffuseur: 'Diffuseurs',
  coffret: 'Coffrets',
};

export const USAGE_LABELS: Record<string, string> = {
  relaxation: 'Relaxation',
  sante: 'Santé',
  beaute: 'Beauté',
  energie: 'Énergie',
  digestion: 'Digestion',
};

export const SETTING_LABELS: Record<keyof Settings, string> = {
  phone_cm: 'Téléphone Cameroun (affiché)',
  whatsapp_cm: 'WhatsApp Cameroun (chiffres uniquement, ex. 237650826738)',
  phone_ca: 'Téléphone Canada (affiché) — laisser vide pour masquer',
  whatsapp_ca: 'WhatsApp Canada (chiffres uniquement) — laisser vide pour masquer',
  email: 'Email',
  address: 'Adresse (Cameroun)',
  address_ca: 'Adresse (Canada) — laisser vide pour masquer',
  hours: "Horaires d'ouverture",
  instagram: 'Lien Instagram',
  facebook: 'Lien Facebook',
  tiktok: 'Lien TikTok',
  stat_satisfaction: 'Chiffre : taux de satisfaction en % (ex. 98) — vide = masqué',
  stat_consultations: 'Chiffre : consultations réalisées (ex. 500) — vide = masqué',
  stat_clients: 'Chiffre : clients satisfaits (ex. 1000) — vide = masqué',
};

export type Certification = { id: string; label: string; icon: string; published: boolean; sort: number };
export type Result = {
  id: string;
  title: string;
  text: string;
  before_url: string | null;
  after_url: string | null;
  published: boolean;
  sort: number;
};
