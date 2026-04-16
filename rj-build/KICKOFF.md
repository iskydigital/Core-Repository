# Claude Code kickoff prompt — Rejuvenation Journeys

Paste as your first message in Claude Code. Attach all four reference files + SPEC.md.

---

I'm building a client portal for a travel agency. Read SPEC.md first — it's the canonical source of truth. Then review the four reference files:

- `reference/sample-itinerary-rendered.html` — the existing Hawaii flyer. Full visual target for the client portal.
- `reference/sample-day-card.html` — clean extraction showing how a single itinerary day card renders across the 5 background variants and the special (birthday) treatment.
- `reference/hawaii-background.svg` — the decorative botanical SVG that goes behind the Hawaii trip's itinerary.
- `reference/hawaii-seed-data.json` — pre-parsed seed data containing the actual Hawaii trip content. Load this in the Prisma seed script so Brenda opens the admin with her real content already populated.

Key context:
- This app lives in my existing Turborepo monorepo at `apps/rejuvenation-journeys`
- I already have PostgreSQL, PM2, and CyberPanel running on my VPS (reference: `apps/rich-groomer`)
- Domain: `rejuvenationjourneys.com`
- Goes live for 13 travelers on Cheryl's Hawaii trip within 1 week

The data model has a repeater for ItineraryDay records (not a single rich text blob for the itinerary). Each day has structured fields PLUS a Tiptap rich-text body field with custom marks for "event time" (gold italic) and "highlight" (lavender italic). See SPEC for Tiptap config details.

The visual target for `/trip/portal` is `sample-itinerary-rendered.html` — match it. The variant system is documented in `sample-day-card.html` — follow it.

Build in the order specified in SPEC. For each step:
1. Tell me what you're about to build
2. Build it
3. Run typecheck + build to confirm clean
4. Move on

Make reasonable judgment calls on ambiguities aligned with the reference files. Don't pause for copy decisions — write it, I'll edit. External API keys come when we reach integration steps.

When v1 is done, produce a deployment checklist: VPS commands, PM2 ecosystem file, CyberPanel vhost config for the LiteSpeed reverse proxy.

Ready.
