require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'owner@example.com';
  const password = process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!';
  const hashed = await bcrypt.hash(password, 10);

  await prisma.admin.upsert({
    where: { email },
    update: { password: hashed },
    create: { email, password: hashed }
  });
  console.log(`Admin account ready: ${email}`);

  await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      companyName: 'DK Associated',
      tagline: 'Trusted plots & flats, built on transparency.',
      email: '',
      whatsapp: '',
      phone: '',
      address: '',
      mapLink: '',
      aboutText: 'Tell your clients about DK Associated here. Edit this from the admin dashboard.'
    }
  });
  console.log('Site settings row ready (edit values from /admin/settings).');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
