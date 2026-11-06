import Link from 'next/link';
import { prisma } from '../lib/prisma';
import HeroSlideshow from '../components/HeroSlideshow';
import SocialButtons from '../components/SocialButtons';
import Reveal from '../components/Reveal';
import CountUp from '../components/CountUp';
import ClientThoughts from '../components/ClientThoughts';
import AnimatedHeading from '../components/AnimatedHeading';
import PropertyCarousel from '../components/PropertyCarousel';
import { TextTicker } from '../components/Marquee';
import { WhyChoose, HowItWorks, VerifyChecklist, Glimpses, FaqSection, EnquiryBand, SectionHeading } from '../components/Sections';
import { QUOTES, TICKER, defaultAbout } from '../lib/content';
import { formatPrice, parsePhotos } from '../lib/utils';

export const revalidate = 0;

async function getData() {
  const [settings, featured, slides, recent] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'singleton' } }).catch(() => null),
    prisma.property.findMany({ where: { featured: true }, orderBy: { createdAt: 'desc' }, take: 8 }).catch(() => []),
    prisma.slide.findMany({ where: { active: true }, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] }).catch(() => []),
    prisma.property.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }).catch(() => [])
  ]);

  const properties = featured.length > 0 ? featured : recent.slice(0, 8);

  // photos for the gallery strip: property photos + slideshow photos
  const photos = [];
  recent.forEach((p) => parsePhotos(p.photos).slice(0, 2).forEach((u) => photos.push(u)));
  slides.forEach((s) => photos.push(s.imageUrl));
  const gallery = Array.from(new Set(photos)).slice(0, 14);

  return { settings, properties, slides, gallery };
}

export default async function HomePage() {
  const { settings, properties, slides, gallery } = await getData();
  const company = settings?.companyName || 'us';
  const tagline = settings?.tagline || 'Trusted plots & flats, built on transparency.';
  const sideImage = slides[1]?.imageUrl || slides[0]?.imageUrl || settings?.heroImageUrl || null;
  const bandImage = slides[0]?.imageUrl || settings?.heroImageUrl || null;

  const carouselItems = properties.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    city: p.city,
    type: p.type,
    status: p.status,
    photo: parsePhotos(p.photos)[0] || null,
    price: p.priceLabel || formatPrice(p.price),
    area: `${p.area} ${p.areaUnit}`
  }));

  const stats = settings
    ? [
        { value: settings.yearsExperience, label: 'Years of experience' },
        { value: settings.happyClients, label: 'Happy clients' },
        { value: settings.verifiedProperties, label: 'Verified properties' },
        { value: settings.expertSupport, label: 'Expert support' }
      ].filter((x) => x.value)
    : [];

  const heroContent = (
    <div className="container-page py-24 md:py-32 text-white">
      <p className="uppercase tracking-wide text-sm text-[var(--clay-light)] font-semibold mb-4 fade-up">
        {settings?.address || 'Property advisory'}
      </p>
      <AnimatedHeading text={tagline} className="font-display text-4xl md:text-6xl leading-tight max-w-2xl" baseDelay={150} />
      <p className="mt-6 max-w-xl text-white/85 fade-up-3">
        {settings?.aboutText
          ? settings.aboutText.slice(0, 220)
          : 'Browse verified plots and flats, backed by clear documentation and a team that answers.'}
      </p>
      <div className="mt-9 flex flex-wrap gap-4 fade-up-4">
        <Link href="/properties" className="btn-primary focus-ring">View properties</Link>
        <Link href="/contact" className="inline-flex items-center gap-2 border border-white/50 text-white px-6 py-3 rounded-sm hover:bg-white/10 transition-colors focus-ring">
          Talk to us
        </Link>
      </div>
      <SocialButtons settings={settings} className="mt-6" />
    </div>
  );

  return (
    <div>
      {slides.length > 0 ? (
        <>
          <HeroSlideshow slides={slides.map((x) => ({ id: x.id, imageUrl: x.imageUrl, title: x.title, subtitle: x.subtitle, linkUrl: x.linkUrl }))} />
          <section className="bg-[var(--forest)] text-white relative overflow-hidden">
            <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-white/5 float-y" aria-hidden="true" />
            <div className="container-page py-12 md:py-20 relative">
              <p className="uppercase tracking-wide text-sm text-[var(--clay-light)] font-semibold mb-3 fade-up">
                {settings?.address || 'Property advisory'}
              </p>
              <AnimatedHeading text={tagline} className="font-display text-3xl md:text-6xl leading-tight max-w-4xl" baseDelay={200} />
              <div className="mt-8 flex flex-wrap gap-4 fade-up-4">
                <Link href="/properties" className="btn-primary !bg-white !text-[var(--forest)] hover:!bg-[var(--paper)] focus-ring">
                  View properties
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 border border-white/50 text-white px-6 py-3 rounded-sm hover:bg-white/10 transition-colors focus-ring">
                  Talk to us
                </Link>
              </div>
              <SocialButtons settings={settings} className="mt-6 fade-up-4" />
            </div>
          </section>
        </>
      ) : (
        <section
          className="relative border-b border-[var(--line)]"
          style={
            settings?.heroImageUrl
              ? {
                  backgroundImage: `linear-gradient(180deg, rgba(18,53,36,0.72), rgba(18,53,36,0.85)), url(${settings.heroImageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }
              : { backgroundColor: 'var(--forest)' }
          }
        >
          {heroContent}
        </section>
      )}

      <TextTicker items={TICKER} />

      {stats.length > 0 && (
        <section className="bg-white border-b border-[var(--line)]">
          <div className="container-page py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((x, i) => (
              <Reveal key={x.label} variant="zoom" delay={i * 100}>
                <div className="font-display text-3xl md:text-5xl text-[var(--forest)]"><CountUp value={x.value} /></div>
                <div className="text-xs md:text-sm text-[var(--ink)]/60 mt-1">{x.label}</div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="container-page py-16 md:py-24">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-2">
          <SectionHeading eyebrow="Featured properties" title="Plots & flats we recommend" />
          <Reveal>
            <Link href="/properties" className="arrow-link text-sm font-semibold text-[var(--clay)] focus-ring mb-10 inline-flex gap-2">
              View all properties <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
        {carouselItems.length === 0 ? (
          <div className="border border-dashed border-[var(--line)] p-12 text-center text-[var(--ink)]/60">
            Properties will appear here soon.
          </div>
        ) : (
          <PropertyCarousel items={carouselItems} />
        )}
      </section>

      <WhyChoose company={settings?.companyName} />
      <VerifyChecklist />
      <HowItWorks />
      <Glimpses photos={gallery} />
      <ClientThoughts quotes={QUOTES} />

      <section className="bg-white border-y border-[var(--line)]">
        <div className="container-page py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <Reveal variant="left">
            <p className="uppercase tracking-wide text-xs text-[var(--clay)] font-semibold mb-2">About us</p>
            <h2 className="font-display text-3xl md:text-5xl text-[var(--forest)] mb-6 heading-line">About {settings?.companyName || 'us'}</h2>
            <p className="text-[var(--ink)]/80 leading-relaxed whitespace-pre-line">
              {settings?.aboutText || defaultAbout(company)}
            </p>
            <Link href="/about" className="btn-outline mt-7 inline-flex focus-ring">Read our story</Link>
          </Reveal>
          <Reveal variant="right">
            {sideImage && (
              <div className="aspect-[4/3] overflow-hidden bg-[var(--line)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={sideImage} alt="" loading="lazy" className="h-full w-full object-cover" />
              </div>
            )}
            <div className={`border border-[var(--line)] p-7 bg-[var(--paper)] ${sideImage ? '-mt-12 ml-6 mr-0 sm:mr-24 relative shadow-lg' : ''}`}>
              <h3 className="font-display text-xl text-[var(--forest)] mb-4">Reach us directly</h3>
              <ul className="space-y-3 text-sm">
                {settings?.phone && <li>Call: <a href={`tel:${settings.phone}`} className="font-medium hover:underline focus-ring">{settings.phone}</a></li>}
                {settings?.email && <li>Email: <a href={`mailto:${settings.email}`} className="font-medium hover:underline focus-ring">{settings.email}</a></li>}
                {settings?.address && <li>Visit: <span className="font-medium">{settings.address}</span></li>}
                {!settings?.phone && !settings?.email && !settings?.address && (
                  <li className="text-[var(--ink)]/60">Add contact details from the admin settings page.</li>
                )}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <FaqSection />
      <EnquiryBand settings={settings} image={bandImage} />
    </div>
  );
}
