# Barlow Custom Engravings

Full-stack Next.js 15 app for Barlow Custom Engravings — a custom laser engraving business based in El Paso, TX.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **ORM**: Prisma 6.x with Neon (PostgreSQL)
- **Auth**: NextAuth.js v5 (credentials provider, single admin user)
- **Storage**: Cloudflare R2 (S3-compatible) for images
- **Email**: Resend with React Email templates
- **State**: Zustand (order modal)
- **Toasts**: Sonner

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon (PostgreSQL) connection string |
| `NEXTAUTH_SECRET` | Random secret. Generate with: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Full URL of your site (e.g. `http://localhost:3000`) |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of admin password (see below) |
| `R2_ACCOUNT_ID` | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | R2 access key |
| `R2_SECRET_ACCESS_KEY` | R2 secret key |
| `R2_BUCKET_NAME` | R2 bucket name |
| `R2_PUBLIC_URL` | Public base URL for R2 bucket (e.g. `https://pub-xxx.r2.dev`) |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | From address for outgoing email |
| `RESEND_TO_EMAIL` | Admin notification email recipient |
| `NEXT_PUBLIC_SITE_URL` | Public site URL |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Instagram profile URL |
| `NEXT_PUBLIC_FACEBOOK_URL` | Facebook page URL |
| `NEXT_PUBLIC_PHONE` | Contact phone number |
| `NEXT_PUBLIC_EMAIL` | Contact email address |

### 3. Generate admin password hash

```bash
node -e "require('bcryptjs').hash('yourpassword', 12).then(h => console.log(h))"
```

Copy the output into `ADMIN_PASSWORD_HASH` in `.env.local`.

### 4. Set up the database

Push the schema to your Neon database:

```bash
npm run db:push
```

Or use migrations:

```bash
npm run db:migrate
```

### 5. Seed the database

```bash
npm run db:seed
```

This seeds:
- **Type tags**: Wallet, Trifold Wallet, Bifold Wallet, Wood Panel, Keychain, Dog Tag
- **Theme tags**: NFL, NBA, NCAA, Anime, Dragon, Skull, Western, Military, Custom Name, Pop Culture
- **Offerings**: Bifold Wallet ($20), Trifold Wallet ($30), Wood Art Panel (Custom Quote), Dog Tag ($10), Keychain ($10)

### 6. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Site Structure

| Route | Description |
|---|---|
| `/` | Homepage with hero, offerings strip, gallery preview, how it works |
| `/gallery` | Full gallery with status + tag filters |
| `/shop` | For-sale items with two-axis tag filter |
| `/shop/[id]` | Item detail page |
| `/order` | Standalone custom order form |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Order inbox with status filter |
| `/admin/orders/[id]` | Order detail + status/notes management |
| `/admin/items` | Item list with edit/delete |
| `/admin/items/new` | Add new item with image upload |
| `/admin/items/[id]/edit` | Edit existing item |
| `/admin/offerings` | Offerings/pricing management |
| `/admin/tags` | Tag management |

---

## Cloudflare R2 Setup

1. Create a Cloudflare account and a new R2 bucket
2. Enable public access on the bucket and note the public URL
3. Create an API token with R2 read/write permissions
4. Set `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, and `R2_PUBLIC_URL` in `.env.local`

Item images are stored under `items/` and order reference images under `orders/`.

---

## Resend Setup

1. Create a [Resend](https://resend.com) account
2. Add and verify your sending domain
3. Create an API key and set `RESEND_API_KEY`
4. Set `RESEND_FROM_EMAIL` (must be from your verified domain) and `RESEND_TO_EMAIL`

---

## Useful Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run db:push      # Push Prisma schema to DB (no migration)
npm run db:migrate   # Create and apply a migration
npm run db:seed      # Seed tags and offerings
npm run db:studio    # Open Prisma Studio
```
