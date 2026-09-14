'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';

export default function AdminProfileForm({ initialEmail }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState(initialEmail || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword && newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setSaving(true);
    const res = await fetch('/api/admin/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword,
        newEmail: newEmail !== initialEmail ? newEmail : undefined,
        newPassword: newPassword || undefined
      })
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setError(data.error || 'Could not update your login.');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    if (data.passwordChanged || (data.email && data.email !== initialEmail)) {
      setMessage('Login updated. Please sign in again with your new details.');
      setTimeout(() => signOut({ callbackUrl: '/admin/login' }), 1800);
    } else {
      setMessage('Login updated.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 bg-white border border-[var(--line)] p-6 max-w-2xl">
      <h2 className="font-display text-lg text-[var(--forest)]">Admin login</h2>
      <p className="text-sm text-[var(--ink)]/60 -mt-2">
        Change the email or password used to sign in to this dashboard.
      </p>

      {message && <p className="text-sm text-[var(--forest)] bg-[#e4efe6] border border-[#c3ddc9] p-3">{message}</p>}
      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 p-3">{error}</p>}

      <label className="block text-sm">
        <span className="block mb-1 font-medium text-[var(--ink)]/80">Current password *</span>
        <input
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="input"
          autoComplete="current-password"
        />
      </label>

      <label className="block text-sm">
        <span className="block mb-1 font-medium text-[var(--ink)]/80">Login email</span>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="input"
          autoComplete="email"
        />
      </label>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block text-sm">
          <span className="block mb-1 font-medium text-[var(--ink)]/80">New password</span>
          <span className="block text-xs text-[var(--ink)]/50 mb-1">Leave blank to keep your current password</span>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input"
            autoComplete="new-password"
            minLength={8}
          />
        </label>
        <label className="block text-sm">
          <span className="block mb-1 font-medium text-[var(--ink)]/80">Confirm new password</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input"
            autoComplete="new-password"
          />
        </label>
      </div>

      <div>
        <button type="submit" disabled={saving} className="btn-primary focus-ring disabled:opacity-60">
          {saving ? 'Saving…' : 'Update login'}
        </button>
      </div>
    </form>
  );
}
