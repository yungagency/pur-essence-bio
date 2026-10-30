'use client';
import { useActionState } from 'react';
import { login } from '../actions';

export default function LoginForm({ disabled }: { disabled: boolean }) {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="admin-form">
      {state?.error && <div className="form-msg err">{state.error}</div>}
      <label>
        Email
        <input type="email" name="email" required autoComplete="username" />
      </label>
      <label>
        Mot de passe
        <input type="password" name="password" required autoComplete="current-password" />
      </label>
      <button className="btn primary" style={{ justifyContent: 'center', padding: '.75rem' }} disabled={pending || disabled}>
        {pending ? 'Connexion…' : 'Se connecter'}
      </button>
    </form>
  );
}
