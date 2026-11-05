-- Safe to run on a database that already has these columns (IF NOT EXISTS).
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "virtualTourUrl" TEXT;

ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "yearsExperience" TEXT NOT NULL DEFAULT '15+';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "happyClients" TEXT NOT NULL DEFAULT '1,200+';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "verifiedProperties" TEXT NOT NULL DEFAULT '100%';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "expertSupport" TEXT NOT NULL DEFAULT '24/7 Guidance';
