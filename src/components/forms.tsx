'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { submitRequest, submitReview, type FormState } from '@/app/actions';

function Honeypot() {
  return (
    <div className="hp-field" aria-hidden="true">
      <label>
        Ne pas remplir
        <input type="text" name="site_web" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

function Result({ state }: { state: FormState }) {
  if (!state) return null;
  return (
    <div className={`form-msg ${state.ok ? 'ok' : 'err'}`} role="status">
      {state.message}
      {state.wa && (
        <div style={{ marginTop: '.7rem' }}>
          <a className="button button-primary button-sm" href={state.wa} target="_blank" rel="noopener">
            <i className="fab fa-whatsapp"></i> Envoyer sur WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}

function useResetOnSuccess(state: FormState) {
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);
  return ref;
}

/* ---------------- Avis ---------------- */
export function ReviewForm() {
  const [state, action, pending] = useActionState(submitReview, null);
  const ref = useResetOnSuccess(state);
  const [len, setLen] = useState(0);
  return (
    <form ref={ref} action={action} className="form-card">
      <h3>
        <i className="fas fa-star" style={{ color: 'var(--gold)' }}></i> Donner mon avis
      </h3>
      <Result state={state} />
      <Honeypot />
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="r-name">Prénom et initiale *</label>
          <input id="r-name" name="name" required maxLength={40} placeholder="Ex. Amina M." />
        </div>
        <div className="form-group">
          <label htmlFor="r-city">Ville</label>
          <input id="r-city" name="city" maxLength={40} placeholder="Ex. Yaoundé" />
        </div>
      </div>
      <div className="form-group">
        <span style={{ display: 'block', fontWeight: 600, marginBottom: '.4rem', fontSize: '.9rem' }}>Note *</span>
        <div className="stars-input" role="radiogroup" aria-label="Note sur 5">
          {[5, 4, 3, 2, 1].map((n) => (
            <span key={n} style={{ display: 'contents' }}>
              <input type="radio" id={`star-${n}`} name="rating" value={n} required />
              <label htmlFor={`star-${n}`} title={`${n} étoile${n > 1 ? 's' : ''}`}>
                ★
              </label>
            </span>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="r-product">Produit utilisé</label>
        <input id="r-product" name="product" maxLength={60} placeholder="Ex. Huile de lavande" />
      </div>
      <div className="form-group">
        <label htmlFor="r-text">Votre avis *</label>
        <textarea
          id="r-text"
          name="text"
          required
          minLength={10}
          maxLength={600}
          onChange={(e) => setLen(e.target.value.length)}
          placeholder="Décrivez votre expérience…"
        />
        <span className="char-count">{len}/600</span>
      </div>
      <button className="button button-primary" style={{ width: '100%' }} disabled={pending}>
        {pending ? 'Envoi…' : 'Envoyer mon avis'}
      </button>
      <p className="muted small" style={{ marginTop: '.8rem' }}>
        Les avis sont publiés après vérification. Votre prénom et votre ville seront affichés.
      </p>
    </form>
  );
}

/* ---------------- Consultation ---------------- */
const SLOTS = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
const TYPES = ['Aromathérapie', 'Beauté', 'Bien-être'];
const OBJECTIVES = [
  'Relaxation et sommeil',
  'Énergie et vitalité',
  'Beauté et soins de la peau',
  'Santé et immunité',
  'Gestion du stress',
  'Autre',
];

function minDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function ConsultationForm() {
  const [state, action, pending] = useActionState(submitRequest, null);
  const ref = useResetOnSuccess(state);
  const [dateError, setDateError] = useState('');
  return (
    <form ref={ref} action={action} className="form-card">
      <h3>
        <i className="fas fa-calendar-check" style={{ color: 'var(--accent)' }}></i> Réserver une consultation
      </h3>
      <Result state={state} />
      <Honeypot />
      <input type="hidden" name="kind" value="consultation" />
      <div className="form-group">
        <span style={{ display: 'block', fontWeight: 600, marginBottom: '.4rem', fontSize: '.9rem' }}>Type de consultation</span>
        <div className="choice-group">
          {TYPES.map((t, i) => (
            <label key={t}>
              <input type="radio" name="consult_type" value={t} defaultChecked={i === 0} />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="c-date">Date souhaitée</label>
          <input
            id="c-date"
            type="date"
            name="consult_date"
            min={minDate()}
            onChange={(e) => {
              const d = new Date(e.target.value + 'T12:00:00');
              setDateError(d.getDay() === 0 ? 'Nous sommes fermés le dimanche.' : '');
            }}
          />
          {dateError && <span className="small" style={{ color: 'var(--danger)' }}>{dateError}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="c-time">Créneau</label>
          <select id="c-time" name="consult_time" defaultValue="">
            <option value="">Indifférent</option>
            {SLOTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="c-name">Nom complet *</label>
          <input id="c-name" name="name" required maxLength={80} />
        </div>
        <div className="form-group">
          <label htmlFor="c-phone">Téléphone / WhatsApp *</label>
          <input id="c-phone" name="phone" type="tel" required maxLength={30} placeholder="+237 6XX XX XX XX" />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="c-obj">Objectif</label>
        <select id="c-obj" name="subject" defaultValue="">
          <option value="">Choisir un objectif</option>
          {OBJECTIVES.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="c-msg">Précisions (optionnel)</label>
        <textarea id="c-msg" name="message" maxLength={2000} placeholder="Vos besoins, vos questions…" />
      </div>
      <button className="button button-primary" style={{ width: '100%' }} disabled={pending || !!dateError}>
        {pending ? 'Envoi…' : 'Envoyer ma demande'}
      </button>
      <p className="muted small" style={{ marginTop: '.8rem' }}>
        Le créneau vous est confirmé par téléphone ou WhatsApp. Ne partagez pas d'informations médicales sensibles dans ce formulaire.
      </p>
    </form>
  );
}

/* ---------------- Contact ---------------- */
export function ContactForm() {
  const [state, action, pending] = useActionState(submitRequest, null);
  const ref = useResetOnSuccess(state);
  return (
    <form ref={ref} action={action} className="form-card contact-form">
      <h3>
        <i className="fas fa-paper-plane"></i> Envoyez-nous un message
      </h3>
      <Result state={state} />
      <Honeypot />
      <input type="hidden" name="kind" value="contact" />
      <div className="form-group">
        <label htmlFor="ct-name">Nom complet *</label>
        <input id="ct-name" name="name" required maxLength={80} />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="ct-phone">Téléphone</label>
          <input id="ct-phone" name="phone" type="tel" maxLength={30} />
        </div>
        <div className="form-group">
          <label htmlFor="ct-email">Email</label>
          <input id="ct-email" name="email" type="email" maxLength={120} />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="ct-subject">Sujet</label>
        <select id="ct-subject" name="subject" defaultValue="">
          <option value="">Choisir un sujet</option>
          <option>Information sur un produit</option>
          <option>Commande</option>
          <option>Prise de rendez-vous</option>
          <option>Partenariat / revente</option>
          <option>Autre</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="ct-msg">Message *</label>
        <textarea id="ct-msg" name="message" required minLength={5} maxLength={2000} rows={5} />
      </div>
      <button className="button button-primary" style={{ width: '100%' }} disabled={pending}>
        {pending ? 'Envoi…' : 'Envoyer'}
      </button>
    </form>
  );
}
