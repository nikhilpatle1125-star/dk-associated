import { notFound } from 'next/navigation';
import { prisma } from '../../../../../lib/prisma';
import { parsePhotos } from '../../../../../lib/utils';
import PropertyForm from '../../../../../components/PropertyForm';

export const revalidate = 0;

export default async function EditPropertyPage({ params }) {
  const property = await prisma.property.findUnique({ where: { id: params.id } });
  if (!property) notFound();

  const initial = {
    ...property,
    photos: parsePhotos(property.photos)
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-[var(--forest)] mb-8">Edit property</h1>
      <PropertyForm initial={initial} propertyId={property.id} />
    </div>
  );
}
