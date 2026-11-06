import Link from 'next/link';
import { prisma } from '../../lib/prisma';
import Reveal from '../../components/Reveal';
import CountUp from '../../components/CountUp';
import ClientThoughts from '../../components/ClientThoughts';
import SocialButtons from '../../components/SocialButtons';
import AnimatedHeading from '../../components/AnimatedHeading';
import { WhyChoose, HowItWorks, VerifyChecklist, ValuesGrid, FaqSection, CtaBand } from '../../components/Sections';
import { QUOTES, defaultAbout } from '../../lib/content';

export const metadata = { title: 'About' };
export const revalidate = 0;

export default async function AboutPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } }).catch(() => null);
  const company = settings?.companyName || 'us';

  const stats = settings
    ? [
        { value: settings.yearsExperience, label: 'Years of experience' },
        { value: settings.happyClients, label: 'Happy clients' },
        { value: settings.verifiedProperties, label: 'Verified properties' },
        { value: settings.expertSupport, label: 'Expert support' }
      ].filter((x) => x.value)
    : [];

  return (
    <div>
      <section className="bg-[var(--forest)] text-white">
        <div className="container-page py-16 md:py-24">
          <p className="uppercase tracking-wide text-sm text-[var(--clay-light)] font-semibold mb-3 fade-up">About us</p>
          <AnimatedHeading
            text={settings?.tagline || 'Trusted plots & flats, built on transparency.'}
            className="font-display text-4xl md:text-6xl leading-tight max-w-3xl"
            baseDelay={150}
          />
          <p className="mt-6 max-w-xl text-white/80 fade-up-3">
            {company === 'us' ? 'We' : company} helps families and investors in Nagpur buy property with confidence.
          </p>
        </div>
      </section>

      <section className="container-page py-16 md:py-24 grid md:grid-cols-5 gap-12">
        <Reveal variant="left" className="md:col-span-3">
          <p className="uppercase tracking-wide text-xs text-[var(--clay)] font-semibold mb-2">Our story</p>
          <h2 className="font-display text-3xl md:text-4xl text-[var(--forest)] mb-5">Who we are</h2>
          <p className="text-[var(--ink)]/85 leading-relaxed whitespace-pre-line text-lg">
            {settings?.aboutText || defaultAbout(company)}
          </p>
        </Reveal>

        <Reveal variant="right" delay={150} className="md:col-span-2 grid gap-5 content-start">
          <div className="card-lift bg-white border border-[var(--line)] p-6">
            <h3 className="font-display text-xl text-[var(--forest)] mb-2">Our mission</h3>
            <p className="text-sm text-[var(--ink)]/75 leading-relaxed">
              To make buying property in Nagpur simple, safe and stress-free, with honest advice and clear paperwork at every step.
            </p>
          </div>
          <div className="card-lift bg-white border border-[var(--line)] p-6">
            <h3 className="font-display text-xl text-[var(--forest)] mb-2">Our vision</h3>
            <p className="text-sm text-[var(--ink)]/75 leading-relaxed">
              To be the most trusted name in Nagpur real estate, the one families recommend to their friends and relatives.
            </p>
          </div>
        </Reveal>
      </section>

      {stats.length > 0 && (
        <section className="bg-white border-y border-[var(--line)]">
          <div className="container-page py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((x) => (
              <div key={x.label}>
                <div className="font-display text-3xl md:text-4xl text-[var(--forest)]"><CountUp value={x.value} /></div>
                <div className="text-xs md:text-sm text-[var(--ink)]/60 mt-1">{x.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <ValuesGrid />
      <ClientThoughts quotes={QUOTES} />
      <WhyChoose company={settings?.companyName} />
      <VerifyChecklist />
      <HowItWorks />
      <FaqSection />

      <section className="container-page py-16 md:py-20">
        <Reveal className="border border-[var(--line)] bg-white p-8 md:p-10 grid sm:grid-cols-2 gap-8">
          <div>
            <h2 className="font-display text-2xl text-[var(--forest)] mb-4">Visit or contact us</h2>
            <div className="grid gap-5 text-sm">
              {settings?.address && (
                <div>
                  <div className="text-[var(--ink)]/60 mb-1">Office</div>
                  <div className="font-medium">{settings.address}</div>
                </div>
              )}
              {settings?.phone && (
                <div>
                  <div className="text-[var(--ink)]/60 mb-1">Phone</div>
                  <a href={`tel:${settings.phone}`} className="font-medium hover:underline focus-ring">{settings.phone}</a>
                </div>
              )}
              {settings?.email && (
                <div>
                  <div className="text-[var(--ink)]/60 mb-1">Email</div>
                  <a href={`mailto:${settings.email}`} className="font-medium hover:underline focus-ring">{settings.email}</a>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-center gap-4">
            <p className="text-[var(--ink)]/75">Follow us and message us directly:</p>
            <SocialButtons settings={settings} variant="light" />
            {settings?.mapLink && (
              <a href={settings.mapLink} target="_blank" rel="noopener noreferrer" className="btn-outline w-fit focus-ring">
                Open in Google Maps
              </a>
            )}
            <Link href="/properties" className="text-[var(--forest)] underline underline-offset-4 focus-ring w-fit">
              Browse our properties →
            </Link>
          </div>
        </Reveal>
      </section>

      <CtaBand settings={settings} />
    </div>
  );
}
