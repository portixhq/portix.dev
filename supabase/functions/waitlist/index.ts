// Supabase Edge Function: receives a waitlist signup, stores it, and sends
// a confirmation email via Resend. Deploy with:
//   supabase functions deploy waitlist
// Required secrets (see README.md "Connecting Supabase + Resend"):
//   supabase secrets set RESEND_API_KEY=...
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically.

import { createClient } from 'npm:@supabase/supabase-js@2';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function optionalText(value: unknown): string | undefined {
  const trimmed = String(value ?? '').trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ message: 'Method not allowed' }, 405);
  }

  let email: string;
  let name: string | undefined;
  let github: string | undefined;
  let company: string | undefined;
  let framework: string | undefined;
  let printer: string | undefined;
  let useCase: string | undefined;
  try {
    const body = await req.json();
    email = String(body.email ?? '').trim().toLowerCase();
    name = optionalText(body.name);
    github = optionalText(body.github);
    company = optionalText(body.company);
    framework = optionalText(body.framework);
    printer = optionalText(body.printer);
    useCase = optionalText(body.useCase);
  } catch {
    return jsonResponse({ message: 'Invalid JSON body' }, 400);
  }

  if (!EMAIL_PATTERN.test(email)) {
    return jsonResponse({ message: 'Please provide a valid email address' }, 400);
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { error: insertError } = await supabase
    .from('waitlist')
    .insert({ email, name, github, company, framework, printer, use_case: useCase });

  if (insertError) {
    // Unique constraint violation = already signed up. Treat as success so
    // the UI doesn't leak whether an email is already on the list.
    if (insertError.code !== '23505') {
      console.error('waitlist insert failed', insertError);
      return jsonResponse({ message: 'Could not save your signup — please try again' }, 500);
    }
  } else {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (resendApiKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'PortixOne <hello@portix.dev>',
            to: email,
            subject: "You're on the PortixOne Developer Preview list",
            text: "Thanks for joining! We'll reach out directly to set up your integration — no spam, just a real conversation about your printing use case.",
          }),
        });
      } catch (emailError) {
        // Don't fail the signup if the confirmation email fails to send.
        console.error('resend send failed', emailError);
      }
    }
  }

  return jsonResponse({ message: 'ok' });
});
