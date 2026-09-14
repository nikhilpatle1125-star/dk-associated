require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

(async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  console.log('Email in .env:', JSON.stringify(email));
  console.log('Password in .env:', JSON.stringify(password));

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    console.log('RESULT: No admin found in the database with that email.');
  } else {
    const match = await bcrypt.compare(password, admin.password);
    console.log('RESULT: Password matches?', match);
  }
  await prisma.$disconnect();
})();