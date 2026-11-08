# Jio TWgether｜揪團啦！

A deployable Next.js + Supabase starter website with a public event directory, event registration, and protected admin dashboard. All event examples are intentionally omitted: you create real events yourself.

## What works
- Public homepage and event pages; mobile responsive warm cream/orange design.
- Supabase email/password admin login, admin allowlist, draft/publish/full/cancel event status.
- Admin can create events, see registrations, cancel individual registrations.
- Public signup form with atomic database-enforced capacity, duplicate prevention, and no public access to signup lists.
- No payment processing or automatic email confirmation in this version.

## Setup (about 20–40 minutes)
1. Create a free project at https://supabase.com. In SQL Editor, paste and run `supabase/schema.sql`.
2. In Supabase > Authentication > Users, create an admin account (email and password). Copy the user UUID. In SQL Editor run `insert into public.admins(user_id) values ('UUID_HERE');`.
3. In Supabase > Project Settings > API, copy project URL, publishable/anon key, and **service_role secret**. Create `.env.local` from `.env.example` and fill values. Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser or commit `.env.local`.
4. Install Node.js 20+; run `npm install` and `npm run dev`. Visit http://localhost:3000 and http://localhost:3000/admin.
5. In the admin dashboard create an event, then change its status from draft to published. Test with an ordinary browser session and verify registration count.
6. Push this project to a **private** GitHub repository. Deploy via https://vercel.com/new (Import Git Repository). Set all three environment variables in Vercel Project Settings > Environment Variables. Deploy and test the live URL.
7. Add the live URL to Instagram @jiotwgether bio. Optional: buy a custom domain later.

## Security and launch checklist
- The service-role key is used only on server routes; admin membership is checked before accessing it.
- The SQL function locks the event row, so simultaneous signups cannot exceed capacity.
- Public users can only read published/full events, never registrant personal data.
- Registration form includes a honeypot but **not** rate limiting or CAPTCHA. Before public promotion, add Cloudflare Turnstile and server-side verification plus rate limiting to prevent spam/abuse.
- Password reset and transactional confirmation emails are not implemented. Use Supabase Auth reset functionality and a verified email service (e.g., Resend) before relying on automated confirmations.
- A registration success message appears only when the database accepts the record; no email is sent yet.
- Event dates are stored in UTC. The admin form interprets datetime-local in the **admin browser's local time zone**, so set your computer time zone to Boston/New York when entering dates.
- Do not enter private home addresses in public events. Share exact meetup details privately if necessary.
- Publish a privacy notice and retention/deletion policy before collecting real registrant data; keep admin access limited.
- Paid activities: this site records a price for display only and does not charge money or reconcile payments.
- Use Vercel plan appropriate to actual usage and terms; verify free-tier/commercial limitations.

## Next improvements
Edit existing events; image uploads via Supabase Storage; waitlist; CSV export; auto emails; anti-spam; organizer-friendly timezone controls; privacy page.
