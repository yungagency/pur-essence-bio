'use client';
import { useActionState, useState } from 'react';
import { saveProduct } from '../../../actions';
import { imgSrc } from '@/lib/format';
import { CATEGORY_LABELS, USAGE_LABELS } from '@/lib/types';
import type { Product } from '@/lib/types';

export default function ProductForm({ product: p }: { product: Product | null }) {
  const [state, action, pending] = useActionState(saveProduct, null);
  const [preview, setPreview] = useState<string | null>(imgSrc(p?.image_url));

  return (
    <form action={action} className="admin-form">
      {state?.error && <div className="form-msg err">{state.error}</div>}
      {p && <input type="hidden" name="id" value={p.id} />}
      <input type="hidden" name="image_url" value={p?.image_url ?? ''} />

      <div className="panel admin-form">
        <div className="grid-2">
          <label>
            Nom *
            <input type="text" name="name" required defaultValue={p?.name} />
          </label>
          <label>
            Lien (slug)
            <input type="text" name="slug" defaultValue={p?.slug} placeholder="généré depuis le nom" />
            <span className="hint">Ex. « lavande » → /produits/lavande</span>
          </label>
        </div>
        <div className="grid-3">
          <label>
            Nom botanique (latin)
            <input type="text" name="latin_name" defaultValue={p?.latin_name ?? ''} placeholder="Ex. Lavandula angustifolia" />
          </label>
          <label>
            Nom anglais
            <input type="text" name="english_name" defaultValue={p?.english_name ?? ''} />
          </label>
          <label>
            Origine
            <input type="text" name="origin" defaultValue={p?.origin ?? ''} placeholder="Ex. France" />
          </label>
        </div>
        <div className="grid-2">
          <label>
            Contenances proposées
            <input type="text" name="sizes" defaultValue={p?.sizes ?? ''} placeholder="Ex. 5 ml • 10 ml • 15 ml" />
            <span className="hint">Séparées par « • » : le client choisit sa contenance avant de commander.</span>
          </label>
          <label>
            Domaine (synergies)
            <input type="text" name="domain" defaultValue={p?.domain ?? ''} placeholder="Ex. ÉQUILIBRE NERVEUX" />
          </label>
        </div>
        <label>
          Phrase courte (carte produit)
          <input type="text" name="short" defaultValue={p?.short} maxLength={140} />
        </label>
        <div className="grid-3">
          <label>
            Prix (FCFA)
            <input type="number" name="price_fcfa" min={0} step={50} defaultValue={p?.price_fcfa ?? ''} placeholder="vide = sur demande" />
          </label>
          <label>
            Contenance
            <input type="text" name="volume" defaultValue={p?.volume ?? ''} placeholder="Ex. 10 ml" />
          </label>
          <label>
            Ordre d'affichage
            <input type="number" name="sort" defaultValue={p?.sort ?? 0} />
          </label>
        </div>
        <div className="grid-2">
          <label>
            Catégorie
            <select name="category" defaultValue={p?.category ?? 'huile-essentielle'}>
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <label>
            Utilisation principale
            <select name="usage" defaultValue={p?.usage ?? 'sante'}>
              {Object.entries(USAGE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="checks">
          <label>
            <input type="checkbox" name="published" defaultChecked={p?.published ?? true} /> Publié
          </label>
          <label>
            <input type="checkbox" name="in_stock" defaultChecked={p?.in_stock ?? true} /> En stock
          </label>
          <label>
            <input type="checkbox" name="featured" defaultChecked={p?.featured ?? false} /> À la une (accueil)
          </label>
        </div>
      </div>

      <div className="panel admin-form">
        <label>
          Photo
          <div className="btn-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {preview ? <img src={preview} alt="" className="img-preview" /> : <div className="img-preview" />}
            <input
              type="file"
              name="image"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setPreview(URL.createObjectURL(f));
              }}
            />
          </div>
          <span className="hint">JPG, PNG ou WebP, 5 Mo maximum. Format carré conseillé.</span>
        </label>
      </div>

      <div className="panel admin-form">
        <label>
          Présentation
          <textarea name="description" defaultValue={p?.description} rows={5} />
          <span className="hint">Laissez une ligne vide entre deux paragraphes.</span>
        </label>
        <label>
          Carte d'identité (une ligne par information)
          <textarea
            name="identity"
            rows={5}
            defaultValue={(p?.identity ?? []).map((i) => `${i.label} : ${i.value}`).join('\n')}
            placeholder={"Origine : France\nPartie distillée : Sommités fleuries\nMode d'obtention : Distillation à la vapeur d'eau"}
          />
        </label>
        <label>
          Fiche complète
          <textarea name="fiche" defaultValue={p?.fiche ?? ''} rows={18} style={{ fontFamily: 'ui-monospace, monospace', fontSize: '.82rem' }} />
          <span className="hint">
            « ## Titre » = section repliable · « ### Sous-titre » · « #### Petit titre » · « - texte » = puce · autre ligne = paragraphe.
          </span>
        </label>
        <label>
          Points clés (un par ligne, utilisés si la fiche complète est vide)
          <textarea name="benefits" defaultValue={p?.benefits.join('\n')} rows={5} />
          <span className="hint">Évitez les promesses de guérison : préférez « traditionnellement utilisée pour… ».</span>
        </label>
        <label>
          Conseils d'utilisation
          <textarea name="usage_tips" defaultValue={p?.usage_tips} rows={3} />
        </label>
        <label>
          Précautions spécifiques
          <textarea name="precautions" defaultValue={p?.precautions ?? ''} rows={3} placeholder="Ex. Déconseillée aux femmes enceintes et aux enfants de moins de 6 ans." />
          <span className="hint">Un avertissement général est déjà affiché sous chaque produit.</span>
        </label>
      </div>

      <div className="btn-row">
        <button className="btn primary" disabled={pending}>
          {pending ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}
