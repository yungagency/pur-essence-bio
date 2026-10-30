import { requireAdmin } from '@/lib/admin';
import type { Faq } from '@/lib/types';
import { deleteFaq, saveFaq } from '../../actions';

function FaqForm({ f }: { f?: Faq }) {
  return (
    <form action={saveFaq} className="admin-form">
      {f && <input type="hidden" name="id" value={f.id} />}
      <label>
        Question
        <input type="text" name="question" required defaultValue={f?.question} />
      </label>
      <label>
        Réponse
        <textarea name="answer" required defaultValue={f?.answer} rows={3} />
      </label>
      <div className="btn-row">
        <label>
          Ordre <input type="number" name="sort" defaultValue={f?.sort ?? 0} style={{ width: 90 }} />
        </label>
        <label className="checks" style={{ display: 'flex' }}>
          <input type="checkbox" name="published" defaultChecked={f?.published ?? true} /> Visible
        </label>
        <button className="btn primary">{f ? 'Enregistrer' : 'Ajouter'}</button>
      </div>
    </form>
  );
}

export default async function AdminFaq() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from('faqs').select('*').order('sort');
  const faqs = (data as Faq[]) ?? [];
  return (
    <>
      <h1>FAQ</h1>
      <p className="sub">Questions affichées sur la page Consultation.</p>
      {faqs.map((f) => (
        <div key={f.id} className="panel">
          <FaqForm f={f} />
          <form action={deleteFaq} style={{ marginTop: '.6rem' }}>
            <input type="hidden" name="id" value={f.id} />
            <button className="btn danger">Supprimer</button>
          </form>
        </div>
      ))}
      <div className="panel">
        <h2 style={{ fontSize: '1.05rem', marginBottom: '.8rem' }}>Nouvelle question</h2>
        <FaqForm />
      </div>
    </>
  );
}
