import Link from 'next/link';
import Reveal from './Reveal';
import ContactForm from './ContactForm';
import { PhotoStrip } from './Marquee';
import { whatsappLink } from '../lib/utils';
import { WHY, STEPS, FAQ, VALUES, CHECKLIST } from '../lib/content';

export function SectionHeading({ eyebrow, title, intro }) {
  return (
    <Reveal className="max-w-2xl mb-10">
      {eyebrow && <p className="uppercase tracking-wide text-xs text-[var(--clay)] font-semibold mb-2">{eyebrow}</p>}
      <h2 className="font-display text-3xl md:text-5xl text-[var(--forest)] heading-line">{title}</h2>
      {intro && <p className="text-[var(--ink)]/70 mt-3">{intro}</p>}
    </Reveal>
  );
}

export function WhyChoose({ company }) {
  return (
    <section className="container-page py-16 md:py-24">
      <SectionHeading
        eyebrow="Why choose us"
        title={`Why families trust ${company || 'us'}`}
        intro="Buying property should feel safe. Here is how we make it that way."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {WHY.map((w, i) => (
          <Reveal key={w.title} delay={(i % 3) * 100} className="card-lift bg-white border border-[var(--line)] p-6">
            <div className="text-3xl mb-4" aria-hidden="true">{w.icon}</div>
            <h3 className="font-display text-xl text-[var(--forest)] mb-2">{w.title}</h3>
            <p className="text-sm text-[var(--ink)]/75 leading-relaxed">{w.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section className="bg-white border-y border-[var(--line)]">
      <div className="container-page py-16 md:py-24">
        <SectionHeading eyebrow="How it works" title="Your property journey, in four simple steps" />
        <ol className="grid gap-6 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 120} className="relative">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--forest)] text-white font-display text-lg">
                  {i + 1}
                </span>
                {i < STEPS.length - 1 && <span className="hidden md:block flex-1 h-px bg-[var(--line)]" aria-hidden="true" />}
              </div>
              <h3 className="font-display text-xl text-[var(--forest)] mb-1">{s.title}</h3>
              <p className="text-sm text-[var(--ink)]/75 leading-relaxed">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ValuesGrid() {
  return (
    <section className="container-page py-16 md:py-24">
      <SectionHeading eyebrow="What we stand for" title="Our values" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((v, i) => (
          <Reveal key={v.title} delay={i * 100} className="card-lift border-t-4 border-[var(--clay)] bg-white p-6 border-x border-b border-x-[var(--line)] border-b-[var(--line)]">
            <h3 className="font-display text-xl text-[var(--forest)] mb-2">{v.title}</h3>
            <p className="text-sm text-[var(--ink)]/75 leading-relaxed">{v.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section className="container-page py-16 md:py-24 max-w-3xl">
      <SectionHeading eyebrow="FAQ" title="Questions buyers often ask" />
      <div className="divide-y divide-[var(--line)] border border-[var(--line)] bg-white">
        {FAQ.map((f) => (
          <details key={f.q} className="group p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-[var(--forest)] focus-ring">
              {f.q}
              <span className="text-xl text-[var(--clay)] transition-transform duration-300 group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <p className="mt-3 text-sm text-[var(--ink)]/75 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function CtaBand({ settings }) {
  const wa = settings?.whatsapp
    ? whatsappLink(settings.whatsapp, 'Hello, I would like to visit a property. Please share details.')
    : null;
  return (
    <section className="bg-[var(--forest)] text-white">
      <Reveal className="container-page py-14 md:py-20 text-center">
        <h2 className="font-display text-3xl md:text-4xl mb-3">Ready to see a property in person?</h2>
        <p className="text-white/80 max-w-xl mx-auto mb-8">
          Tell us what you are looking for and we will arrange a free site visit at a time that suits you.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {settings?.phone && (
            <a href={`tel:${settings.phone}`} className="inline-flex items-center gap-2 bg-white text-[var(--forest)] px-6 py-3 rounded-sm font-medium hover:bg-[var(--paper)] transition-colors focus-ring">
              Call {settings.phone}
            </a>
          )}
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-white/60 px-6 py-3 rounded-sm hover:bg-white/10 transition-colors focus-ring">
              Chat on WhatsApp
            </a>
          )}
          <Link href="/contact" className="inline-flex items-center gap-2 border border-white/60 px-6 py-3 rounded-sm hover:bg-white/10 transition-colors focus-ring">
            Send an enquiry
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

export function VerifyChecklist() {
  return (
    <section className="bg-[var(--forest)] text-white relative overflow-hidden">
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/5 float-y" aria-hidden="true" />
      <div className="container-page py-16 md:py-24 relative">
        <Reveal className="max-w-2xl mb-10">
          <p className="uppercase tracking-wide text-xs text-[var(--clay-light)] font-semibold mb-2">Know before you buy</p>
          <h2 className="font-display text-3xl md:text-5xl">8 things to check on every property</h2>
          <p className="text-white/75 mt-4">We help you verify each one before you pay a rupee.</p>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CHECKLIST.map((c, i) => (
            <Reveal key={c.title} variant="zoom" delay={(i % 4) * 90} className="border border-white/20 bg-white/5 p-5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--clay)] text-white text-sm" aria-hidden="true">✓</span>
                <h3 className="font-display text-lg">{c.title}</h3>
              </div>
              <p className="text-sm text-white/75 leading-relaxed">{c.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Glimpses({ photos }) {
  if (!photos || photos.length < 4) return null;
  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="container-page">
        <SectionHeading eyebrow="Glimpses" title="A look at our properties" />
      </div>
      <PhotoStrip photos={photos} />
    </section>
  );
}

export function EnquiryBand({ settings, image }) {
  const wa = settings?.whatsapp
    ? whatsappLink(settings.whatsapp, 'Hello, I would like to know more about your properties.')
    : null;
  return (
    <section
      className="relative parallax-bg text-white"
      style={image ? { backgroundImage: `url(${image})` } : { backgroundColor: 'var(--forest)' }}
    >
      <div className="absolute inset-0 bg-[var(--forest)]/85" aria-hidden="true" />
      <div className="container-page relative py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <Reveal variant="left">
          <p className="uppercase tracking-wide text-xs text-[var(--clay-light)] font-semibold mb-3">Get in touch</p>
          <h2 className="font-display text-3xl md:text-5xl leading-tight">Let’s find the place you will call home.</h2>
          <p className="mt-5 text-white/80 max-w-md">
            Share a few details and we will call you back, arrange a free site visit and answer every question.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            {settings?.phone && (
              <a href={`tel:${settings.phone}`} className="inline-flex items-center gap-2 bg-white text-[var(--forest)] px-6 py-3 rounded-sm font-medium hover:bg-[var(--paper)] transition-colors focus-ring">
                Call {settings.phone}
              </a>
            )}
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-white/60 px-6 py-3 rounded-sm hover:bg-white/10 transition-colors focus-ring">
                WhatsApp us
              </a>
            )}
          </div>
        </Reveal>
        <Reveal variant="right" className="bg-white text-[var(--ink)] p-6 md:p-8 shadow-xl">
          <h3 className="font-display text-2xl text-[var(--forest)] mb-4">Request a call back</h3>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
