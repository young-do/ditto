// ref: https://sdorra.dev/posts/2023-08-03-google-auth-on-the-edge

import { JWTPayload, SignJWT, importPKCS8 } from 'jose';

type Token = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

export async function createFcmAccessToken() {
  const clientEmail = process.env.NEXT_PUBLIC_FCM_CLIENT_EMAIL as string;
  const rawPrivateKey = (process.env.NEXT_PUBLIC_FCM_PRIVATE_KEY as string).replace(/\\n/g, '\n');
  const privateKey = await importPKCS8(rawPrivateKey, 'RS256');

  const payload: JWTPayload = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://www.googleapis.com/oauth2/v4/token',
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
    iat: Math.floor(Date.now() / 1000),
  };

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuedAt()
    .setIssuer(clientEmail)
    .setAudience('https://www.googleapis.com/oauth2/v4/token')
    .setExpirationTime('5min')
    .sign(privateKey);

  // Form data for the token request
  const form = {
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: jwt,
  };

  // Make the token request
  const tokenResponse = await fetch('https://www.googleapis.com/oauth2/v4/token', {
    method: 'POST',
    body: JSON.stringify(form),
    headers: { 'Content-Type': 'application/json' },
  });

  return (await tokenResponse.json()) as Token;
}
