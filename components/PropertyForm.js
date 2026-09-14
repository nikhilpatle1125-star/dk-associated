'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUploadField from './FileUploadField';

const emptyProperty = {
  title: '',
  type: 'PLOT',
  price: '',
  priceLabel: '',
  area: '',
  areaUnit: 'sq.ft.',
  status: 'AVAILABLE',
  description: '',
  address: '',
  city: '',
  mapLink: '',
  photos: [],
  layoutMapUrl: null,
  brochureUrl: null,
  plotDimensions: '',
  facing: '',
  cornerPlot: false,
  boundaryWall: false,
  bhk: '',
  floor: '',
  totalFloors: '',
  furnishing: '',
  parking: false,
  featured: false
};

export default function PropertyForm({ initial, propertyId }) {
  const router = useRouter();
  const [form, setForm] = useState(() => ({ ...emptyProperty, ...(initial || {}) }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const url = propertyId ? `/api/properties/${propertyId}` : '/api/properties';
    const method = propertyId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Could not save this property.');
      return;
    }

    router.push('/admin/properties');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 max-w-3xl">
      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 p-3">{error}</p>}

      <Section title="Basics">
        <Field label="Title" required>
          <input required value={form.title} onChange={(e) => set('title', e.target.value)} className="input" />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Property type" required>
            <select value={form.type} onChange={(e) => set('type', e.target.value)} className="input">
              <option value="PLOT">Plot</option>
              <option value="FLAT">Flat</option>
            </select>
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={(e) => set('status', e.target.value)} className="input">
              <option value="AVAILABLE">Available</option>
              <option value="ON_HOLD">On hold</option>
              <option value="BOOKED">Booked</option>
              <option value="SOLD">Sold</option>
            </select>
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Price (₹)" required>
            <input type="number" required min="0" value={form.price} onChange={(e) => set('price', e.target.value)} className="input" />
          </Field>
          <Field label="Price label override (optional)" hint="e.g. 'Negotiable' — shown instead of the amount above">
            <input value={form.priceLabel || ''} onChange={(e) => set('priceLabel', e.target.value)} className="input" />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Area" required>
            <input type="number" required min="0" value={form.area} onChange={(e) => set('area', e.target.value)} className="input" />
          </Field>
          <Field label="Area unit">
            <select value={form.areaUnit} onChange={(e) => set('areaUnit', e.target.value)} className="input">
              <option value="sq.ft.">sq.ft.</option>
              <option value="sq.m.">sq.m.</option>
              <option value="acres">acres</option>
              <option value="gunthas">gunthas</option>
            </select>
          </Field>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
          Show on homepage as featured
        </label>
      </Section>

      <Section title="Location">
        <Field label="City / area">
          <input value={form.city} onChange={(e) => set('city', e.target.value)} className="input" />
        </Field>
        <Field label="Full address">
          <input value={form.address} onChange={(e) => set('address', e.target.value)} className="input" />
        </Field>
        <Field label="Google Maps link (optional)">
          <input value={form.mapLink || ''} onChange={(e) => set('mapLink', e.target.value)} className="input" placeholder="https://maps.google.com/..." />
        </Field>
      </Section>

      <Section title="Description">
        <textarea
          rows={5}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          className="input"
          placeholder="Describe the property for buyers"
        />
      </Section>

      {form.type === 'PLOT' ? (
        <Section title="Plot details">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Dimensions" hint="e.g. 30ft x 40ft">
              <input value={form.plotDimensions || ''} onChange={(e) => set('plotDimensions', e.target.value)} className="input" />
            </Field>
            <Field label="Facing">
              <select value={form.facing || ''} onChange={(e) => set('facing', e.target.value)} className="input">
                <option value="">Not specified</option>
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="West">West</option>
                <option value="North-East">North-East</option>
                <option value="North-West">North-West</option>
                <option value="South-East">South-East</option>
                <option value="South-West">South-West</option>
              </select>
            </Field>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.cornerPlot} onChange={(e) => set('cornerPlot', e.target.checked)} />
              Corner plot
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.boundaryWall} onChange={(e) => set('boundaryWall', e.target.checked)} />
              Boundary wall built
            </label>
          </div>
        </Section>
      ) : (
        <Section title="Flat details">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Configuration" hint="e.g. 2 BHK">
              <input value={form.bhk || ''} onChange={(e) => set('bhk', e.target.value)} className="input" />
            </Field>
            <Field label="Floor" hint="e.g. 3rd floor">
              <input value={form.floor || ''} onChange={(e) => set('floor', e.target.value)} className="input" />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Total floors in building">
              <input type="number" min="0" value={form.totalFloors || ''} onChange={(e) => set('totalFloors', e.target.value)} className="input" />
            </Field>
            <Field label="Furnishing">
              <select value={form.furnishing || ''} onChange={(e) => set('furnishing', e.target.value)} className="input">
                <option value="">Not specified</option>
                <option value="Unfurnished">Unfurnished</option>
                <option value="Semi-furnished">Semi-furnished</option>
                <option value="Fully furnished">Fully furnished</option>
              </select>
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.parking} onChange={(e) => set('parking', e.target.checked)} />
            Parking available
          </label>
        </Section>
      )}

      <Section title="Photos & documents">
        <FileUploadField
          label="Photos"
          accept="image/png,image/jpeg,image/webp"
          multiple
          value={form.photos}
          onChange={(v) => set('photos', v)}
          hint="First photo is used as the cover image."
        />
        <FileUploadField
          label="Layout map"
          accept="image/png,image/jpeg,image/webp,application/pdf"
          value={form.layoutMapUrl}
          onChange={(v) => set('layoutMapUrl', v)}
        />
        <FileUploadField
          label="Brochure (PDF)"
          accept="application/pdf"
          value={form.brochureUrl}
          onChange={(v) => set('brochureUrl', v)}
        />
      </Section>

      <div className="flex gap-4">
        <button type="submit" disabled={saving} className="btn-primary focus-ring disabled:opacity-60">
          {saving ? 'Saving…' : propertyId ? 'Save changes' : 'Add property'}
        </button>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid var(--line);
          padding: 0.5rem 0.75rem;
          background: #fff;
        }
        .input:focus-visible {
          outline: 2px solid var(--clay);
          outline-offset: 2px;
        }
      `}</style>
    </form>
  );
}

function Section({ title, children }) {
  return (
    <fieldset className="grid gap-4">
      <legend className="font-display text-lg text-[var(--forest)] mb-1">{title}</legend>
      {children}
    </fieldset>
  );
}

function Field({ label, required, hint, children }) {
  return (
    <label className="block text-sm">
      <span className="block mb-1 font-medium text-[var(--ink)]/80">
        {label} {required && <span className="text-[var(--clay)]">*</span>}
      </span>
      {hint && <span className="block text-xs text-[var(--ink)]/50 mb-1">{hint}</span>}
      {children}
    </label>
  );
}
