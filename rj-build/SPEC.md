# Rejuvenation Journeys — Build Spec v2

## Project summary

A minimal client portal for Brenda Walker's travel agency. First trip going live is Cheryl's 70th birthday Hawaii trip, 13 travelers, April 23-27, 2025. System supports future trips without rework, but v1 is optimized for this one.

- **Legal entity:** Isky Digital LLC
- **Agency brand:** Walker Green Travel (Brenda's personal brand)
- **Product brand:** Rejuvenation Journeys (DBA of Isky Digital LLC)
- **Domain:** `rejuvenationjourneys.com`
- **Admins (hardcoded whitelist):**
  - `walkergreentravel@gmail.com` (Brenda Walker)
  - `Sethjdeyo@gmail.com` (Seth Deyo)

## Tech stack

- Next.js 14 App Router, TypeScript, Tailwind CSS
- Prisma ORM + PostgreSQL
- Located at `apps/rejuvenation-journeys` inside existing Turborepo monorepo
- PM2 process on VPS (31.97.148.228)
- CyberPanel vhost with LiteSpeed reverse proxy
- Cloudflare DNS + SSL via Let's Encrypt

## External services

- **Resend** — transactional email (admin code delivery, client credential delivery)
- **Twilio** — SMS (client credential delivery)
- A2P 10DLC registration via Twilio under Isky Digital LLC as Brand, "Rejuvenation Journeys — Travel Portal Access" as Campaign

## Reference files

Claude Code should read these files from `reference/` before building anything visual:

- `reference/sample-itinerary-rendered.html` — Brenda's actual flyer, full rendered visual target
- `reference/sample-day-card.html` — Cleaned-up reference showing the 5 background variants + special treatment for a single day card
- `reference/hawaii-background.svg` — Extracted SVG background, drops into the Hawaii trip as a fixed background asset
- `reference/hawaii-seed-data.json` — Pre-parsed Hawaii trip data for the Prisma seed script

The day card visual target is defined by `sample-day-card.html`. The full page visual target is defined by `sample-itinerary-rendered.html`. Match these aesthetically on the client portal.

## Data model

```prisma
model Trip {
  id                 String   @id @default(uuid())
  slug               String   @unique
  title              String           // "Cheryl's Sensational 70th"
  subtitle           String?          // "Sun, Sand & Seventy Years of Stunning"
  destination        String           // "Honolulu, Hawaii"
  destinationLabel   String?          // "Honolulu, Hawaii · April 2025" (header eyebrow text)
  dateStart          DateTime
  dateEnd            DateTime
  datesBadge         String?          // "April 23 – 27, 2025" (display string)
  heroImageUrl       String?
  svgBackgroundKey   String   @default("hawaii")  // references static SVG asset by key
  contactName        String
  contactPhone       String
  contactEmail       String
  footerMessage      String?          // "Seventy never looked so good — and Hawaii agrees."
  footerSub          String?          // "We're so grateful to celebrate this milestone..."
  mahaloText         String?          // "M A H A L O"
  status             String   @default("active")  // "draft" | "active" | "archived"
  itineraryDays      ItineraryDay[]
  clients            Client[]
  excursions         Excursion[]
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

model ItineraryDay {
  id                String   @id @default(uuid())
  tripId            String
  trip              Trip     @relation(fields: [tripId], references: [id], onDelete: Cascade)
  dayNumber         Int              // 1, 2, 3...
  dayLabel          String           // "Day One"
  dayName           String           // "Thursday, April 23"
  dayTitle          String           // "Group Arrival & Aloha Vibes"
  bodyContent       String   @db.Text  // Rich text HTML from Tiptap
  dressNote         String?          // Gold-border callout (optional)
  isSpecial         Boolean  @default(false)  // Birthday variant treatment
  backgroundVariant Int      @default(0)      // 0-4, auto-cycled by dayNumber
  sortOrder         Int
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  @@index([tripId, sortOrder])
}

model Client {
  id                 String   @id @default(uuid())
  tripId             String
  trip               Trip     @relation(fields: [tripId], references: [id])
  firstName          String
  lastName           String
  email              String
  phone              String   // E.164 format
  passcode           String   // 6-digit numeric
  credentialsSentAt  DateTime?
  lastLoginAt        DateTime?
  assignments        Assignment[]
  createdAt          DateTime @default(now())
  @@index([email])
  @@index([phone])
}

model Excursion {
  id              String   @id @default(uuid())
  tripId          String
  trip            Trip     @relation(fields: [tripId], references: [id], onDelete: Cascade)
  title           String
  description     String   @db.Text  // Rich text HTML
  date            DateTime
  duration        String?
  pricePerPerson  String?
  imageUrl        String?
  sortOrder       Int      @default(0)
  assignments     Assignment[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Assignment {
  id          String    @id @default(uuid())
  clientId    String
  client      Client    @relation(fields: [clientId], references: [id], onDelete: Cascade)
  excursionId String
  excursion   Excursion @relation(fields: [excursionId], references: [id], onDelete: Cascade)
  assignedAt  DateTime  @default(now())
  @@unique([clientId, excursionId])
}

model AdminSession {
  id           String   @id @default(uuid())
  adminEmail   String
  sessionToken String   @unique
  expiresAt    DateTime
  createdAt    DateTime @default(now())
}

model AdminLoginCode {
  id         String   @id @default(uuid())
  adminEmail String
  code       String   // 6-digit numeric, hashed
  expiresAt  DateTime
  usedAt     DateTime?
  createdAt  DateTime @default(now())
}
```

## The itinerary — hybrid schema explained

The itinerary is a **repeater of ItineraryDay records** belonging to a Trip. Each day has structured metadata fields (label, name, title, dressNote) AND a rich-text body field that supports Tiptap custom marks for event times and location highlights.

### Tiptap configuration for bodyContent

Base extensions: StarterKit (paragraph, bold, italic, bullet list, ordered list, hard break).

Custom marks:
- **`eventTime`** — renders as `<span data-event-time>...</span>`. Applied via toolbar button labeled "Time". Styles: gold color, italic, 600 weight.
- **`highlight`** — renders as `<span data-highlight>...</span>`. Applied via toolbar button labeled "Location". Styles: lavender color, italic.

Admin workflow: Brenda types the day's body text freely. She selects "7:00 PM" and clicks the Time button. She selects "Tiki's Bar · Twin Fin Hotel" and clicks the Location button. The output HTML has `<span data-event-time>7:00 PM</span>` and `<span data-highlight>Tiki's Bar · Twin Fin Hotel</span>`. The rendered portal styles these via CSS selectors.

### Background variants

Five variants defined in CSS. The system auto-assigns `backgroundVariant = (dayNumber - 1) % 5` unless `isSpecial = true`, which forces variant 1 with a gold border + purple gradient background (the birthday treatment).

Admin can override via a dropdown in the day editor if needed, but default is automatic.

| Variant | Border color | Accent |
|---|---|---|
| 0 | Crimson red | Red radial glow |
| 1 | Purple (or gold if isSpecial) | Purple glow |
| 2 | Violet | Violet glow |
| 3 | Red | Red glow |
| 4 | Gold | Gold glow |

See `reference/sample-day-card.html` for exact CSS.

### SVG background asset

Each trip references an SVG background via `trip.svgBackgroundKey`. For v1, only "hawaii" exists — load from `public/svg-backgrounds/hawaii.svg` (content from `reference/hawaii-background.svg`).

The SVG is rendered as a fixed-position `<svg class="leaf-bg">` element on the client portal, behind the itinerary content. Animation (sway) preserved from the original flyer.

Future trips will add new SVGs (`paris.svg`, `tuscany.svg`, etc.) as needed. No admin UI for SVG upload in v1.

## Seeding Brenda's Hawaii trip

The Prisma seed script (`prisma/seed.ts`) loads `reference/hawaii-seed-data.json` and inserts:

1. One Trip record with all the Hawaii trip metadata
2. Five ItineraryDay records with Brenda's actual content, `bodyContent` already formatted with `data-event-time` and `data-highlight` span wrappers

This means **on first deploy, Brenda logs into the admin panel and sees her actual flyer content already populated**. She can edit any field, add/remove days, reorder, etc. She doesn't start from blank.

Run `pnpm prisma db seed` after migrations to populate.

## Authentication

### Admin
Whitelist (hardcoded): `walkergreentravel@gmail.com`, `Sethjdeyo@gmail.com`

Login flow:
1. Admin enters email
2. System generates 6-digit code, stores hashed in AdminLoginCode with 15min TTL
3. Code emailed via Resend
4. Admin enters code → if valid & unused, session token issued (24h TTL), cookie set
5. Any email not in whitelist: show generic "If this email is registered, a code has been sent" (no admin enumeration)

### Client
Login flow:
1. Enter phone OR email
2. Enter 6-digit passcode
3. System looks up Client by identifier, validates passcode
4. Success → sessionStorage token + redirect to `/trip/portal`
5. Rate limit: 5 failed attempts per IP per hour

## CSV import

Format:
```csv
First Name,Last Name,Phone Number,Email
Cheryl,Walker,+19165551234,cheryl@example.com
Brenda,Walker,+19165551235,brenda@example.com
```

Rules:
- Phone normalized to E.164 (reject malformed)
- Duplicate email/phone within trip: skip, flag in preview
- Upload → preview table with per-row status → admin confirms → valid rows inserted with generated passcodes
- Invalid rows don't block valid rows

## Credential generation & delivery

6-digit numeric passcode, generated at client creation.

### SMS template (Twilio)
```
Aloha {firstName}!

Your Rejuvenation Journeys trip portal is ready.

Passcode: {passcode}

Open your itinerary:
rejuvenationjourneys.com/trip

— Brenda
```

### Email template (Resend)
Subject: `Your {destination} trip portal is ready`

Body: HTML with hero image, trip title/dates, passcode in monospace card, CTA button to `/trip`, Brenda's contact info, footer with "Rejuvenation Journeys — a DBA of Isky Digital LLC".

### Admin actions
- Per-client "Send credentials" button
- Bulk "Send to all pending" button
- Rate limit 1/sec when bulk sending
- Both channels fire in parallel, independent success/failure logging
- Mark `credentialsSentAt` if at least one channel succeeds

## Page routes

### Public
- `/` — Homepage. Hero image, Rejuvenation Journeys tagline, "Access your trip" CTA, Brenda bio teaser
- `/about` — About Brenda, travel philosophy

### Client portal
- `/trip` — Login (email/phone + passcode)
- `/trip/portal` — Authenticated view:
  - Full-page SVG background from `trip.svgBackgroundKey`
  - Header: `destinationLabel`, `title`, `subtitle`, `datesBadge`
  - Divider
  - Contact card ("Questions? Reach Brenda: {phone} / {email}")
  - Itinerary — renders all `ItineraryDay` records sorted by `sortOrder`
  - Your excursions section (client's assigned Excursions)
  - Footer with `footerMessage`, `footerSub`, `mahaloText`
  - **Visual target: match `reference/sample-itinerary-rendered.html`**

### Admin
- `/admin` — Email → code login
- `/admin/clients` — Default landing. List, import CSV, send credentials, reset passcode
- `/admin/clients/import` — CSV upload → preview → confirm
- `/admin/trip` — Trip metadata + itinerary day repeater:
  - Top section: edit Trip fields (title, subtitle, destination, dates, contact, footer text)
  - Below: sortable list of ItineraryDay cards (collapsible)
  - Each day expands to show form: dayLabel, dayName, dayTitle, Tiptap editor for bodyContent (with Time/Location toolbar buttons), dressNote textarea, isSpecial toggle, backgroundVariant dropdown (default auto)
  - "Add day" button at bottom
  - Drag-to-reorder or up/down arrows
  - Save button per day, or autosave on blur
- `/admin/excursions` — CRUD list, similar structure, Tiptap for description
- `/admin/assignments` — Grid: clients × excursions, checkboxes, save on change

## Aesthetic system

Follow `reference/sample-day-card.html` for the itinerary. The rest of the site (marketing pages, login, admin) uses a slightly lighter, more restrained version of the same palette — same fonts, same colors, but less background ornamentation outside the itinerary view.

### Typography
- **Display/decorative:** Cinzel Decorative (labels, main titles, mahalo)
- **Headings/subtitles:** Playfair Display (day names, section headers)
- **Body:** Cormorant Garamond (itinerary body, prose)
- **UI sans (admin panel, forms):** Inter
- **Mono (passcodes only):** JetBrains Mono

### Color palette (from Brenda's flyer, preserved)
```css
--black: #050a05;
--deep-green: #0d2b0d;
--green: #1a5c1a;
--leaf-green: #2d8c2d;
--red: #c41e3a;
--crimson: #8b0000;
--purple: #6a0dad;
--violet: #9b30ff;
--lavender: #d4a0ff;
--gold: #d4af37;
--cream: #fdf5e6;
--white: #ffffff;
```

### Admin panel aesthetic
The admin panel is **lighter and more utilitarian** than the client portal. Cream background (`#fdf5e6`), dark text, subtle green accents. Inter for UI. Playfair for section headers. No dark background, no SVG decorations. This is a tool for Brenda to get work done.

Think: "elegant admin dashboard, editorial tool vibe" — not "party flyer styled form."

## Image sourcing — hand-curated stock photography

All photographic imagery comes from Unsplash. No AI-generated imagery — guests are visiting real places, so real photography beats approximations.

### Directory structure

```
public/images/
├── hero-home.jpg              # Homepage hero banner
├── hero-about.jpg             # About page hero
├── brenda-headshot.jpg        # About page portrait (placeholder until Brenda provides)
└── hawaii/
    ├── hero.jpg               # Client portal hero for Hawaii trip
    ├── excursion-luau.jpg
    ├── excursion-diamond-head.jpg
    ├── excursion-dole-plantation.jpg
    ├── excursion-circle-island.jpg
    ├── excursion-surf-lessons.jpg
    └── excursion-paddleboarding.jpg
```

Per-destination subdirectories scale for future trips (`public/images/paris/`, `public/images/tuscany/`, etc.).

### Centralized image config

All image paths referenced as string constants in a single config file at `lib/images.ts`:

```typescript
export const IMAGES = {
  heroHome: '/images/hero-home.jpg',
  heroAbout: '/images/hero-about.jpg',
  brendaHeadshot: '/images/brenda-headshot.jpg',
  hawaii: {
    hero: '/images/hawaii/hero.jpg',
    excursionLuau: '/images/hawaii/excursion-luau.jpg',
    excursionDiamondHead: '/images/hawaii/excursion-diamond-head.jpg',
    excursionDolePlantation: '/images/hawaii/excursion-dole-plantation.jpg',
    excursionCircleIsland: '/images/hawaii/excursion-circle-island.jpg',
    excursionSurfLessons: '/images/hawaii/excursion-surf-lessons.jpg',
    excursionPaddleboarding: '/images/hawaii/excursion-paddleboarding.jpg',
  },
} as const;
```

Import from this file everywhere imagery is referenced. Swapping images post-launch is a drop-the-new-file-in-place operation with no code changes needed.

### V1 build approach — Unsplash URL placeholders

During the Claude Code build, use Unsplash URLs directly in the config file as placeholders so the site renders with real Hawaii imagery immediately:

```typescript
// Placeholder during build — replace with local paths post-launch
export const IMAGES = {
  heroHome: 'https://images.unsplash.com/photo-XXX?w=2400&q=80',
  hawaii: {
    hero: 'https://images.unsplash.com/photo-YYY?w=2400&q=80',
    // ...
  },
} as const;
```

Claude Code can search Unsplash freely for relevant imagery during the build and pick reasonable defaults. The user will curate and replace these post-launch — it takes approximately 10 minutes to download 8-10 hand-picked images and drop them into `public/images/` with matching filenames, then update the constants in `lib/images.ts` to use local paths.

### Next.js Image component

Use `next/image` with explicit `width`, `height`, and `objectFit: cover` for all photographic imagery. This handles arbitrary source dimensions gracefully when the user swaps images later — any reasonably-sized source file will crop to fit instead of breaking the layout.

Example:
```tsx
import Image from 'next/image';
import { IMAGES } from '@/lib/images';

<Image
  src={IMAGES.hawaii.hero}
  alt="Waikiki Beach at sunset"
  width={2400}
  height={1200}
  className="object-cover w-full h-[60vh]"
  priority
/>
```

### Brenda's headshot

`brenda-headshot.jpg` ships as a tasteful silhouette placeholder (a simple SVG or a generic editorial-style placeholder image). Brenda provides the real headshot post-launch — it drops in at the same filename with no code changes.

## Brand voice for all generated copy

Rejuvenation Journeys is a small, personal travel agency run by Brenda Walker. Voice is warm, confident, quietly expert — like a knowledgeable friend who plans trips for people she genuinely cares about.

**Avoid:** travel clichés ("paradise awaits," "dream destination"), superlatives, exclamation points in marketing copy, corporate-sounding language.

**Prefer:** specific, grounded language, understatement over hype, warmth without saccharine, direct second-person.

The itinerary content from Brenda's flyer IS the voice — festive, personal, exclamation-heavy for the trip content itself. That's her voice when writing FOR CHERYL'S TRIP. The marketing pages speak FOR BRENDA TO FUTURE CLIENTS — more restrained.

## Footer (all pages)

```
Rejuvenation Journeys is a DBA of Isky Digital LLC.
© 2026 Isky Digital LLC. All rights reserved.

Privacy Policy · Terms of Service · Contact Brenda
```

Privacy Policy and Terms stubbed with boilerplate for v1.

## Environment variables

```
DATABASE_URL=postgresql://user:pass@localhost:5432/rejuvenation_journeys
NEXTAUTH_URL=https://rejuvenationjourneys.com
ADMIN_EMAILS=walkergreentravel@gmail.com,Sethjdeyo@gmail.com

RESEND_API_KEY=
RESEND_FROM_EMAIL=brenda@rejuvenationjourneys.com
RESEND_FROM_NAME=Rejuvenation Journeys

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX

NODE_ENV=production
SESSION_SECRET=  # 32+ random chars for session token signing
```

## Build order for Claude Code

1. Scaffold Next.js app at `apps/rejuvenation-journeys` in existing Turborepo
2. Install deps: Prisma, @tiptap/react + starter-kit + custom extensions, Resend SDK, Twilio SDK, DOMPurify, csv-parse, zod, react-hot-toast
3. Copy `reference/hawaii-background.svg` → `public/svg-backgrounds/hawaii.svg`
4. Prisma schema + first migration
5. Seed script at `prisma/seed.ts` that loads `reference/hawaii-seed-data.json`
6. Run seed to populate Cheryl's trip
7. Shared components: Button, Card, Input, Layout, Header, Footer
8. Public homepage
9. About page
10. Client login at `/trip`
11. **Client portal at `/trip/portal`** — visual target: match `reference/sample-itinerary-rendered.html`. Render Trip + ItineraryDays with proper variant classes and SVG background.
12. Admin login at `/admin` + code delivery via Resend
13. Admin layout with sidebar nav
14. Admin clients list + CSV import
15. **Admin trip editor at `/admin/trip`** — metadata form + itinerary day repeater with Tiptap (custom marks for eventTime/highlight)
16. Admin excursions CRUD
17. Admin assignments grid
18. Credential delivery service (Twilio + Resend)
19. Send credentials flows (per-client + bulk)
20. Polish: mobile responsiveness, copy review, empty states
21. Production build, PM2 ecosystem file, deploy instructions

## Deployment

This app lives inside the existing Turborepo monorepo and deploys to the VPS alongside Rich Groomer and other existing apps. Same infrastructure pattern, new subdomain.

### Port assignment

Known ports already in use on VPS `31.97.148.228`:
- `3000` — Rich Groomer (Next.js)
- `3001` — Payload CMS for Rich Groomer
- `5678` — n8n

**Assigned port for Rejuvenation Journeys: `3002`**

Before running `pm2 start`, verify 3002 is actually free:
```bash
ssh root@31.97.148.228 'pm2 list && netstat -tulpn | grep 3002'
```

If taken (e.g., by something added since this spec was written), pick the next free port in the 3000s range (3003, 3004...) and update references in:
- `apps/rejuvenation-journeys/ecosystem.config.js`
- The CyberPanel vhost rewrite rule (see below)
- The `.env` file's `PORT` value

### PM2 ecosystem config

Create `apps/rejuvenation-journeys/ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'rejuvenation-journeys',
      cwd: '/path/to/monorepo/apps/rejuvenation-journeys',
      script: 'node_modules/.bin/next',
      args: 'start -p 3002',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
      },
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      error_file: '/var/log/pm2/rejuvenation-journeys-error.log',
      out_file: '/var/log/pm2/rejuvenation-journeys-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
```

Replace `/path/to/monorepo` with the actual monorepo path on the VPS (match Rich Groomer's location).

### CyberPanel vhost setup

These steps are manual — Claude Code cannot create the vhost. Perform via the CyberPanel UI.

1. **Log into CyberPanel** at `https://31.97.148.228:8090`
2. **Websites → Create Website**
   - Package: Default (or whatever Rich Groomer uses)
   - Owner: admin (or matching user)
   - Domain: `rejuvenationjourneys.com`
   - Email: `walkergreentravel@gmail.com`
   - PHP: None (this is a Node.js app, PHP unused)
3. **Websites → List Websites → rejuvenationjourneys.com → Manage**
4. **SSL → Issue SSL**
   - Include `www.rejuvenationjourneys.com` in the cert
   - Issue via Let's Encrypt
   - Verify cert installs successfully (if it fails, temporarily turn off Cloudflare's orange-cloud proxy for the domain during issuance, re-enable after — same pattern as the previous `rich.iskydigital.co` fix)
5. **Websites → Manage → vHost Conf** — replace the default vhost config with the reverse proxy rule below

### LiteSpeed reverse proxy rule

In the vHost Conf editor, set the entire config to:

```
docRoot                   $VH_ROOT/public_html

vhssl {
  keyFile                 /etc/letsencrypt/live/rejuvenationjourneys.com/privkey.pem
  certFile                /etc/letsencrypt/live/rejuvenationjourneys.com/fullchain.pem
}

context / {
  type                    proxy
  handler                 rejuvenation-journeys-backend
  addDefaultCharset       off
}

extprocessor rejuvenation-journeys-backend {
  type                    proxy
  address                 http://127.0.0.1:3002
  maxConns                100
  pcKeepAliveTimeout      60
  initTimeout             60
  retryTimeout            0
  respBuffer              0
}
```

Click **Save** then **Restart LiteSpeed** from the CyberPanel header.

### Cloudflare DNS

In Cloudflare for `rejuvenationjourneys.com`:

```
Type  Name              Content            Proxy Status
A     @                 31.97.148.228      Proxied (orange cloud)
A     www               31.97.148.228      Proxied (orange cloud)
```

SSL/TLS encryption mode: **Full (strict)** — anything else either breaks the cert or is insecure.

Also add Resend DNS records (SPF, DKIM, DMARC) once Resend provides them — covered in step 3 of pre-launch external setup.

### Deploy sequence

First deploy (run from VPS):

```bash
# 1. Clone or pull monorepo
cd /path/to/monorepo
git pull

# 2. Install dependencies at monorepo root
pnpm install

# 3. Run migrations on production database
pnpm --filter rejuvenation-journeys prisma migrate deploy

# 4. Seed Cheryl's Hawaii trip data
pnpm --filter rejuvenation-journeys prisma db seed

# 5. Build the production bundle
pnpm --filter rejuvenation-journeys build

# 6. Start with PM2
cd apps/rejuvenation-journeys
pm2 start ecosystem.config.js

# 7. Save PM2 process list so it survives reboot
pm2 save

# 8. Verify
pm2 list
curl http://127.0.0.1:3002  # should return HTML
curl https://rejuvenationjourneys.com  # should return same HTML via reverse proxy
```

Subsequent deploys (after code changes):

```bash
cd /path/to/monorepo
git pull
pnpm install  # only if deps changed
pnpm --filter rejuvenation-journeys prisma migrate deploy  # only if migrations added
pnpm --filter rejuvenation-journeys build
pm2 restart rejuvenation-journeys
```

### CyberPanel "Fix Permissions" after deploy

If you hit a 403 Forbidden after deploy (same pattern as `opscale.iskydigital.com`), run:

```bash
ssh root@31.97.148.228 \
  'cd /usr/local/CyberCP && python manage.py fix_permissions rejuvenationjourneys.com'
```

Or click the "Fix Permissions" button in the CyberPanel UI for that site. This resets ownership and sets the correct 755/644 file modes.

### Environment variables on production

Create `/path/to/monorepo/apps/rejuvenation-journeys/.env.production` with real values:

```
DATABASE_URL=postgresql://rejuvenation_user:REAL_PASSWORD@localhost:5432/rejuvenation_journeys
NEXTAUTH_URL=https://rejuvenationjourneys.com
ADMIN_EMAILS=walkergreentravel@gmail.com,Sethjdeyo@gmail.com

RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=brenda@rejuvenationjourneys.com
RESEND_FROM_NAME=Rejuvenation Journeys

TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX

NODE_ENV=production
PORT=3002
SESSION_SECRET=GENERATE_32_RANDOM_CHARS_HERE
```

Never commit `.env.production` to git. Add to `.gitignore`.

### PostgreSQL database setup

Run once on the VPS:

```bash
sudo -u postgres psql

CREATE DATABASE rejuvenation_journeys;
CREATE USER rejuvenation_user WITH ENCRYPTED PASSWORD 'strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE rejuvenation_journeys TO rejuvenation_user;
\q
```

Then add to `.env.production`:
```
DATABASE_URL=postgresql://rejuvenation_user:strong_password_here@localhost:5432/rejuvenation_journeys
```

Test connection before first deploy:
```bash
psql "postgresql://rejuvenation_user:strong_password_here@localhost:5432/rejuvenation_journeys" -c "SELECT 1"
```

### Rollback plan

If a bad deploy breaks production:

```bash
cd /path/to/monorepo
git log --oneline -5                    # find last known-good commit
git checkout <commit-sha>
pnpm install
pnpm --filter rejuvenation-journeys build
pm2 restart rejuvenation-journeys
```

Prisma migrations are forward-only by default. If a migration causes issues, either write a new migration that reverses the change, or restore from a database backup.

### Backups

PostgreSQL daily dump (cron on VPS):

```bash
# Add to crontab: 0 3 * * * /usr/local/bin/backup-rj.sh
# /usr/local/bin/backup-rj.sh:
#!/bin/bash
pg_dump -U rejuvenation_user rejuvenation_journeys | \
  gzip > /var/backups/rj-$(date +\%Y\%m\%d).sql.gz
find /var/backups/rj-*.sql.gz -mtime +30 -delete
```

v1 does not require off-site backups (low data volume, low stakes). Add in v2 if the program scales.

## Definition of done (v1)

- Site deployed to `rejuvenationjourneys.com` with HTTPS
- `pm2 list` shows `rejuvenation-journeys` process running on port 3002 (or assigned alternative)
- `curl https://rejuvenationjourneys.com` returns rendered HTML (verifies full reverse proxy chain)
- Brenda logs in at `/admin` (6-digit code via Resend)
- Brenda opens `/admin/trip` and sees Hawaii content already populated (from seed)
- Brenda can edit any day's fields, including Tiptap body with Time/Location marks
- Brenda can add/remove/reorder days
- Brenda can import 13 clients via CSV at `/admin/clients/import`
- Brenda can assign excursions via checkbox grid at `/admin/assignments`
- Brenda clicks "Send credentials to all" — all 13 receive SMS + email with personal passcodes
- Each client logs in with phone/email + passcode at `/trip`
- Each client sees `/trip/portal` that matches `reference/sample-itinerary-rendered.html` visually, rendering the trip's itinerary days with correct variants and SVG background
- Only their assigned excursions appear in the "Your excursions" section
- Renders correctly on mobile Safari + Chrome, desktop Safari + Chrome
- PM2 `ecosystem.config.js` committed to repo
- Deployment runbook (deploy sequence commands) saved at `apps/rejuvenation-journeys/DEPLOY.md`

## Out of scope for v1 (defer to v2+)

- Multiple concurrent trips (data model supports, UI focused on one)
- Client self-selection of optional excursions
- Payment collection
- Image gallery / lightbox
- Custom SVG upload per trip (only "hawaii" exists in v1)
- Admin audit trail
- Scheduled credential send
- Real auth with hashed passwords + forgot password flow
- Multi-language
- Native app
