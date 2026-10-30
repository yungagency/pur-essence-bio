'use client';
import { useState } from 'react';

/** Affiche /images/logo.png s'il existe, sinon le nom de la marque en texte. */
export default function Logo({ light = false }: { light?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className="brand-text" style={light ? { color: '#fff' } : undefined}>
        Pur<span>'</span>Essence
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/logo.png"
      alt="Pur'Essence"
      className="logo"
      style={light ? { filter: 'brightness(10)' } : undefined}
      onError={() => setFailed(true)}
    />
  );
}
