'use server';

import { createSupabasePublic, isSupabaseConfigured } from '@/lib/supabase/server';
import { getSettings } from '@/lib/data';
import { waLink } from '@/lib/format';

export type FormState = { ok: boolean; message: string; wa?: string } | null;

const str = (fd: FormData, k: string, max = 2000) => {
  const v = fd.get(k);
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
};

/** Champ piège invisible : rempli uniquement par les robots. */
const isBot = (fd: FormData) => str(fd, 'site_web') !== '';

export async function submitReview(_prev: FormState, fd: FormData): Promise<FormState> {
  if (isBot(fd)) return { ok: true, message: 'Merci ! Votre avis sera publié après vérification.' };
  const name = str(fd, 'name', 40);
  const city = str(fd, 'city', 40);
  const product = str(fd, 'product', 60);
  const text = str(fd, 'text', 600);
  const rating = Number(fd.get('rating'));

  if (name.length < 2) return { ok: false, message: 'Indiquez votre prénom.' };
  if (!(rating >= 1 && rating <= 5)) return { ok: false, message: 'Choisissez une note de 1 à 5 étoiles.' };
  if (text.length < 10) return { ok: false, message: 'Votre avis doit faire au moins 10 caractères.' };
  if (!isSupabaseConfigured) return { ok: false, message: "Le dépôt d'avis sera disponible très bientôt." };

  const { error } = await createSupabasePublic()
    .from('reviews')
    .insert({ name, city: city || null, product: product || null, text, rating });
  if (error) return { ok: false, message: "L'envoi a échoué. Réessayez dans quelques minutes." };
  return { ok: true, message: 'Merci ! Votre avis sera publié après vérification par notre équipe.' };
}

export async function submitRequest(_prev: FormState, fd: FormData): Promise<FormState> {
  const kind = str(fd, 'kind') === 'consultation' ? 'consultation' : 'contact';
  const name = str(fd, 'name', 80);
  const phone = str(fd, 'phone', 30);
  const email = str(fd, 'email', 120);
  const subject = str(fd, 'subject', 120);
  const message = str(fd, 'message', 2000);
  const consult_date = str(fd, 'consult_date', 10);
  const consult_time = str(fd, 'consult_time', 10);
  const consult_type = str(fd, 'consult_type', 40);

  if (name.length < 2) return { ok: false, message: 'Indiquez votre nom.' };
  if (!phone && !email) return { ok: false, message: 'Indiquez un téléphone ou un email pour que nous puissions vous répondre.' };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, message: 'Adresse email invalide.' };
  if (kind === 'contact' && message.length < 5) return { ok: false, message: 'Écrivez votre message.' };
  if (consult_date && !/^\d{4}-\d{2}-\d{2}$/.test(consult_date)) return { ok: false, message: 'Date invalide.' };

  const s = await getSettings();
  const lines =
    kind === 'consultation'
      ? [
          "Bonjour Pur'Essence, je souhaite réserver une consultation.",
          `Nom : ${name}`,
          phone && `Téléphone : ${phone}`,
          consult_type && `Type : ${consult_type}`,
          consult_date && `Date souhaitée : ${new Date(consult_date + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}`,
          consult_time && `Créneau : ${consult_time}`,
          subject && `Objectif : ${subject}`,
          message && `Précisions : ${message}`,
        ]
      : ["Bonjour Pur'Essence,", `Nom : ${name}`, subject && `Sujet : ${subject}`, message];
  const wa = s.whatsapp_cm ? waLink(s.whatsapp_cm, lines.filter(Boolean).join('\n')) : undefined;

  if (isBot(fd)) return { ok: true, message: 'Merci, votre demande a bien été enregistrée.', wa };

  if (isSupabaseConfigured) {
    const { error } = await createSupabasePublic()
      .from('requests')
      .insert({
        kind,
        name,
        phone: phone || null,
        email: email || null,
        subject: subject || null,
        message: message || null,
        consult_date: consult_date || null,
        consult_time: consult_time || null,
        consult_type: consult_type || null,
      });
    if (error) {
      return { ok: false, message: "L'enregistrement a échoué. Vous pouvez nous écrire directement sur WhatsApp.", wa };
    }
  }
  return {
    ok: true,
    message:
      kind === 'consultation'
        ? 'Demande enregistrée ! Nous vous recontactons pour confirmer le créneau. Pour aller plus vite, envoyez-la aussi sur WhatsApp :'
        : 'Message enregistré ! Nous vous répondons rapidement. Vous pouvez aussi nous l’envoyer sur WhatsApp :',
    wa,
  };
}
