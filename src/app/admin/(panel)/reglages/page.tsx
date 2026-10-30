import { requireAdmin } from '@/lib/admin';
import { DEFAULT_SETTINGS } from '@/lib/data';
import { SETTING_LABELS } from '@/lib/types';
import type { Settings } from '@/lib/types';
import { saveSettings } from '../../actions';

export default async function AdminSettings({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const { ok } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from('settings').select('key,value');
  const values: Record<string, string> = { ...DEFAULT_SETTINGS };
  for (const r of data ?? []) values[r.key] = r.value ?? '';

  return (
    <>
      <h1>Coordonnées et réseaux</h1>
      <p className="sub">Utilisées dans l'en-tête, le pied de page, la page Contact et tous les boutons WhatsApp.</p>
      {ok && <div className="form-msg ok">Enregistré. Le site est mis à jour.</div>}
      <form action={saveSettings} className="panel admin-form">
        {(Object.keys(SETTING_LABELS) as (keyof Settings)[]).map((k) => (
          <label key={k}>
            {SETTING_LABELS[k]}
            {k === 'hours' || k === 'order_info' ? (
              <textarea name={k} defaultValue={values[k]} rows={k === 'order_info' ? 5 : 2} />
            ) : (
              <input type="text" name={k} defaultValue={values[k]} />
            )}
          </label>
        ))}
        <div className="notice small">
          Les numéros WhatsApp s'écrivent avec l'indicatif et sans espace ni « + » (ex. 237650826738 ou 14381234567). Un
          champ vide masque l'élément sur le site.
        </div>
        <div>
          <button className="btn primary">Enregistrer</button>
        </div>
      </form>
    </>
  );
}
