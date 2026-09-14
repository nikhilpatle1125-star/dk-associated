'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false
    });

    setLoading(false);

    if (res?.error) {
      setError('Incorrect email or password.');
      return;
    }
    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[var(--paper)] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white border border-[var(--line)] p-8">
        <h1 className="font-display text-2xl text-[var(--forest)] mb-1">Admin sign in</h1>
        <p className="text-sm text-[var(--ink)]/60 mb-6">Manage properties and site content.</p>

        <label className="block text-sm mb-4">
          <span className="block mb-1 font-medium">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-[var(--line)] px-3 py-2 focus-ring"
          />
        </label>

        <label className="block text-sm mb-6">
          <span className="block mb-1 font-medium">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-[var(--line)] px-3 py-2 focus-ring"
          />
        </label>

        {error && <p className="text-sm text-red-700 mb-4">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center focus-ring disabled:opacity-60">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
