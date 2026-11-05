import { prisma } from '../../../../lib/prisma';
import SlidesManager from '../../../../components/SlidesManager';

export const revalidate = 0;

export default async function AdminSlidesPage() {
  const slides = await prisma.slide
    .findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] })
    .catch(() => []);

  const plain = slides.map((s) => ({ ...s, createdAt: s.createdAt.toISOString() }));

  return (
    <div>
      <h1 className="font-display text-3xl text-[var(--forest)] mb-1">Homepage slideshow</h1>
      <p className="text-[var(--ink)]/60 mb-8">Photos shown in the big banner at the top of the homepage.</p>
      <SlidesManager initialSlides={plain} />
    </div>
  );
}
