import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="login-wrap">
      <div className="login-card" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.6rem', marginBottom: '.5rem' }}>Page introuvable</h1>
        <p className="muted" style={{ marginBottom: '1.5rem' }}>
          Cette page n'existe pas ou a été déplacée.
        </p>
        <Link href="/" className="button button-primary">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
