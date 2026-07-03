# portix.dev

> The developer portal for PortixOne — landing, docs, tutorials, examples, roadmap, changelog, and comparisons. Not just a marketing site: the home for the whole developer ecosystem, separate from a future `portix.one` commercial site.

Astro + TypeScript + Tailwind CSS, deployed on Vercel. Waitlist backed by Supabase (Postgres + Edge Functions) + Resend for confirmation emails.

## Structure

| Route | Status |
|---|---|
| `/` | Hero, problem, how it works, SDK snippet, use cases, waitlist |
| `/docs` | Links to what exists today (runtime + SDK READMEs, examples, cheatsheet) |
| `/learn` | Tutorial stub — empty until the weekly content cycle starts |
| `/examples` | Table linking to [browser-printing-examples](https://github.com/portixhq/browser-printing-examples) |
| `/roadmap` | Real roadmap from printing → cash drawer → scanner → scales → displays → marketplace → full edge platform |
| `/changelog` | Build log #1, in the manual's Built/Learned/Fixed/Next/Question format |
| `/compare` | vs QZ Tray, vs JSPrintManager |

## Local development

```bash
npm install
cp .env.example .env   # fill in Supabase values once you have a project (see below)
npm run dev
```

Without `.env` values, the site still runs — the waitlist form shows a "not connected yet" message instead of crashing.

## Connecting Supabase + Resend

You don't have accounts yet, so here's the exact path to a working waitlist:

### 1. Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. Run the migration in `supabase/migrations/20260702000000_create_waitlist.sql` — either paste it into the Supabase SQL editor, or with the CLI:
   ```bash
   supabase link --project-ref <your-project-ref>
   supabase db push
   ```
3. Deploy the Edge Function:
   ```bash
   supabase functions deploy waitlist
   ```
4. Copy **Project URL** and **anon public key** from Project Settings → API into `.env` as `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_ANON_KEY`.

### 2. Resend

1. Create a free account at [resend.com](https://resend.com) and verify a sending domain (or use their shared test domain to start).
2. Create an API key.
3. Set it as a **Supabase secret** (never in `.env` — the Edge Function reads it server-side):
   ```bash
   supabase secrets set RESEND_API_KEY=re_your_key_here
   ```
4. Update the `from:` address in `supabase/functions/waitlist/index.ts` to match your verified domain (it's currently `hello@portix.dev`).

### 3. Vercel

```bash
vercel link
vercel env add PUBLIC_SUPABASE_URL
vercel env add PUBLIC_SUPABASE_ANON_KEY
vercel --prod
```

Once all three are connected, submitting the waitlist form inserts a row into the `waitlist` table and sends a confirmation email — no code changes needed.

## License

MIT
