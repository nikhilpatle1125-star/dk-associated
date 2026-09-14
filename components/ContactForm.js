'use client';

import { useState } from 'react';

export default function ContactForm({ prefillProperty }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: prefillProperty ? `Hi, I'm interested in "${prefillProperty}".` : ''
  });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, propertyId: prefillProperty || null })
      });
      if (!res.ok) throw new Error('failed');
      setStatus('sent');
      setForm({ name: '', phone: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="border border-[var(--line)] p-8 bg-white text-center">
        <p className="font-display text-xl text-[var(--forest)]">Message sent</p>
        <p className="text-sm text-[var(--ink)]/70 mt-2">We'll get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 bg-white border border-[var(--line)] p-6">
      <Field label="Name" required>
        <input
          required
          value={form.name}
          onChange={update('name')}
          className="w-full border border-[var(--line)] px-3 py-2 focus-ring"
          placeholder="Your name"
        />
      </Field>
      <Field label="Phone" required>
        <input
          required
          value={form.phone}
          onChange={update('phone')}
          className="w-full border border-[var(--line)] px-3 py-2 focus-ring"
          placeholder="10-digit mobile number"
        />
      </Field>
      <Field label="Email (optional)">
        <input
          type="email"
          value={form.email}
          onChange={update('email')}
          className="w-full border border-[var(--line)] px-3 py-2 focus-ring"
          placeholder="you@example.com"
        />
      </Field>
      <Field label="Message" required>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={update('message')}
          className="w-full border border-[var(--line)] px-3 py-2 focus-ring"
          placeholder="Tell us what you're looking for"
        />
      </Field>
      <button type="submit" disabled={status === 'sending'} className="btn-primary justify-center focus-ring disabled:opacity-60">
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
      {status === 'error' && (
        <p className="text-sm text-red-700">Something went wrong. Please try again or use WhatsApp.</p>
      )}
    </form>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block text-sm">
      <span className="block mb-1 font-medium text-[var(--ink)]/80">
        {label} {required && <span className="text-[var(--clay)]">*</span>}
      </span>
      {children}
    </label>
  );
}
