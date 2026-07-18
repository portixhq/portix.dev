import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomUUID } from 'node:crypto';

/**
 * Step 1 of the Sveltia CMS GitHub OAuth flow: redirects the /admin popup to
 * GitHub's authorize screen. See ./callback.ts for step 2.
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  if (!clientId) {
    res.status(500).send('GITHUB_OAUTH_CLIENT_ID is not configured.');
    return;
  }

  const provider = typeof req.query.provider === 'string' ? req.query.provider : 'github';
  if (provider !== 'github') {
    res.status(400).send(`Unsupported provider: ${provider}`);
    return;
  }

  const state = randomUUID();
  const host = req.headers.host;
  const redirectUri = `https://${host}/api/auth/callback`;

  const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set('redirect_uri', redirectUri);
  authorizeUrl.searchParams.set('scope', 'repo,user');
  authorizeUrl.searchParams.set('state', state);

  res.setHeader('Set-Cookie', `sveltia_oauth_state=${state}; HttpOnly; Path=/; Max-Age=600; SameSite=Lax; Secure`);
  res.writeHead(302, { Location: authorizeUrl.toString() });
  res.end();
}
