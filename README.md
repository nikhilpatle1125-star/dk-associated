# DK Associated — website + admin dashboard

A real estate website (Home, Properties, About, Contact) with a simple
admin dashboard for one client user to manage everything: properties,
photos, layout maps, brochures, and site-wide settings (email, WhatsApp,
phone, address, about text, logo, hero image).

Built with Next.js 14 (App Router), Prisma, NextAuth, Tailwind CSS, and
Vercel Blob for file storage.

Nothing about the client is hardcoded — every editable value lives in the
database and is changed from `/admin`.

### What's included, ready to deploy

- **Property dashboard** — the public `/properties` page and each
  property's detail page, backed by a real database (not sample data).
- **Admin login** — a real, server-side authenticated login (NextAuth +
  hashed password), not a front-end-only check.
- **Dashboard with edit properties** — add, edit, delete, and upload
  photos/layout maps/brochures for any property from `/admin/properties`.
- **Editable admin block** — `/admin/settings` includes an "Admin login"
  section where the client can change their own sign-in email and
  password at any time, no code changes needed.
- **A real backend for storing data** — Postgres via Prisma, so
  properties, settings, and enquiries persist permanently (this is the
  piece the single-file demo version couldn't do, since it had no server).

---

## 1. What you need before you start

- A free [Vercel](https://vercel.com) account
- A free [Neon](https://neon.tech) account (or Vercel Postgres) for the
  production database — SQLite (used locally) does not persist on Vercel
- Node.js 18+ installed on your computer, if you want to run it locally
  first (optional, but recommended)

## 2. Run it locally first (recommended)

```bash
cd dk-associated
npm install
cp .env.example .env
```

Open `.env` and set at least:

```
ADMIN_EMAIL="you@example.com"
ADMIN_PASSWORD="pick-a-strong-password"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
```

Leave `DATABASE_URL="file:./dev.db"` as-is for local use.

Then create the database tables and your admin login:

```bash
npx prisma migrate dev --name init
npm run seed
```

Start the site:

```bash
npm run dev
```

- Public site: http://localhost:3000
- Admin dashboard: http://localhost:3000/admin/login (sign in with the
  `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set above)

File uploads (photos, layout maps, brochures) need Vercel Blob, which only
works once you've linked the project to Vercel — see step 4. Until then,
the upload button will show a clear error instead of failing silently.

## 3. Create the production database (Neon)

1. Create a free project at neon.tech.
2. Copy the connection string it gives you (starts with `postgresql://`).
3. Open `prisma/schema.prisma` and change:
   ```
   provider = "sqlite"
   ```
   to:
   ```
   provider = "postgresql"
   ```
4. You'll set the real connection string as an environment variable in
   Vercel in the next step — no need to put it in this file.

## 4. Deploy to Vercel

1. Push this project to a GitHub repository (Vercel deploys from Git).
2. In Vercel: **Add New → Project** → import that repository.
3. Before the first deploy, add these Environment Variables in the
   Vercel project settings (Settings → Environment Variables):

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | your Neon `postgresql://...` connection string |
   | `NEXTAUTH_SECRET` | a random string (`openssl rand -base64 32`) |
   | `NEXTAUTH_URL` | your Vercel URL, e.g. `https://dk-associated.vercel.app` |
   | `ADMIN_EMAIL` | the email the client will sign in with |
   | `ADMIN_PASSWORD` | a strong temporary password (used only once, by the seed script) |

4. In the Vercel project: **Storage → Create Database → Blob**. This
   automatically adds `BLOB_READ_WRITE_TOKEN` to your project's
   environment variables — you don't need to copy it manually.
5. Deploy. Vercel will run `npm run build`, which runs `prisma generate`
   then `next build`.
6. Create the database tables in production (run this once, from your
   own computer, with `DATABASE_URL` temporarily set to the Neon string):
   ```bash
   npx prisma migrate deploy
   npm run seed
   ```
7. Visit `https://your-site.vercel.app/admin/login` and sign in with the
   `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in step 3. **Change this
   password by creating a new admin the same way (re-run the seed script
   with a new `ADMIN_PASSWORD` value) if you ever need to rotate it.**

That's it — the site is live.

## 5. Day-to-day use (for the client)

Everything below is done from `/admin`, no code or developer needed:

- **Add a property**: Admin → Properties → Add a property. Choose Plot
  or Flat and the form shows only the fields relevant to that type.
  Upload photos, a layout map, and a brochure PDF directly in the form.
- **Edit or delete a property**: Admin → Properties → click a listing.
- **Update contact details / WhatsApp / branding**: Admin → Site
  settings. This controls the phone number, WhatsApp number, email,
  address, map link, about text, logo, and homepage hero image
  everywhere on the site.
- **Change the admin login itself**: Admin → Site settings → the
  "Admin login" block at the bottom. Enter the current password once,
  then set a new email and/or password. This is the one thing worth
  doing the moment you first log in — the seed script's `ADMIN_PASSWORD`
  from step 3 below is a temporary password meant to be replaced here.
- **See enquiries**: submissions from the Contact page and "Enquire on
  WhatsApp" clicks (WhatsApp messages themselves land in WhatsApp, not
  here) appear on the Admin dashboard home.

## 6. Project structure, if you want to make code changes later

```
app/                    Pages and API routes (Next.js App Router)
  admin/(protected)/    Dashboard, properties CRUD, settings — auth-gated
  admin/login/          Public login page
  api/                  Route handlers: properties, settings, contact, upload, auth
  properties/[slug]/    Public property detail page
components/             Shared UI: forms, cards, nav, file uploader
lib/                    Prisma client, auth config, shared helpers
prisma/schema.prisma    Database schema (Property, SiteSettings, ContactMessage, Admin)
prisma/seed.js          Creates the first admin login and a default settings row
```

## 7. Notes and limitations

- The admin account is a single shared login by design (one client
  admin, as requested). To add a second admin, run the seed logic again
  with different `ADMIN_EMAIL`/`ADMIN_PASSWORD` values, or insert a row
  into the `Admin` table directly.
- Uploaded files are stored on Vercel Blob (public URLs), not on the
  server's filesystem — this is required on Vercel since serverless
  functions don't have persistent disk storage.
- WhatsApp integration uses `wa.me` click-to-chat links (opens WhatsApp
  with a pre-filled message) — this needs no API keys or approval and
  works for both mobile and desktop.
- This build was compiled and verified locally to ensure every page and
  route builds correctly. `npx prisma generate` itself must run with
  full internet access (it downloads Prisma's query engine) — this
  works normally on your computer and on Vercel.
