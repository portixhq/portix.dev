import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Step 2 of the Sveltia CMS GitHub OAuth flow: GitHub redirects here with a
 * `code`, which is exchanged server-side for an access token (this is the one
 * step that needs a server, since it requires the OAuth app's client secret).
 * The token is then handed back to the /admin popup via postMessage, following
 * the same handshake Sveltia/Decap CMS's github backend expects.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    res.status(500).send('GitHub OAuth is not configured.');
    return;
  }

  const { code, state } = req.query;
  const cookieState = parseCookie(req.headers.cookie).sveltia_oauth_state;

  if (typeof code !== 'string') {
    res.status(400).send('Missing code.');
    return;
  }
  if (!cookieState || cookieState !== state) {
    res.status(400).send('Invalid or expired state.');
    return;
  }

  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  });
  const tokenData = (await tokenResponse.json()) as { access_token?: string; error_description?: string };

  if (!tokenData.access_token) {
    res.status(400).send(`GitHub OAuth error: ${tokenData.error_description ?? 'unknown error'}`);
    return;
  }

  const message = `authorization:github:success:${JSON.stringify({ token: tokenData.access_token, provider: 'github' })}`;

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Set-Cookie', 'sveltia_oauth_state=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; Secure');
  res.send(`<!doctype html>
<html>
  <body>
    <script>
      const receiveMessage = (msg) => {
        window.opener.postMessage(${JSON.stringify(message)}, msg.origin);
        window.removeEventListener('message', receiveMessage, false);
      };
      window.addEventListener('message', receiveMessage, false);
      window.opener.postMessage('authorizing:github', '*');
    </script>
  </body>
</html>`);
}

function parseCookie(header: string | undefined): Record<string, string> {
  if (!header) return {};
  return Object.fromEntries(
    header.split(';').map((pair) => {
      const [key, ...rest] = pair.trim().split('=');
      return [key, decodeURIComponent(rest.join('='))];
    })
  );
}
