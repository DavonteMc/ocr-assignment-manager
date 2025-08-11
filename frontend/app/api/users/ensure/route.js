import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify, createRemoteJWKSet } from "jose";

const API_AUDIENCE = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE;

async function jwksFrom(issuer) {
  return createRemoteJWKSet(new URL(`${issuer.replace(/\/$/, '')}/.well-known/jwks.json`));
}

export async function POST(req) {
  try {
    // 1) Get the access token from the Authorization header
    const auth = req.headers.get('authorization') || '';
    const accessToken = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!accessToken) {
      return NextResponse.json({ error: 'Missing access token' }, { status: 401 });
    }

    // 2) Extract the issuer from the access token to get the correct JWKS
    const parts = accessToken.split('.');
    if (parts.length !== 3) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 401 });
    }
    const accessPreview = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    const iss = accessPreview.iss;

    // 3) Verify the access token against your API audience
    const accessJwks = await jwksFrom(iss);
    await jwtVerify(accessToken, accessJwks, {
      issuer: iss,
      audience: API_AUDIENCE,
    });

    // 4) Fetch user profile using the verified access token
    const resUserinfo = await fetch(`${iss.replace(/\/$/, '')}/userinfo`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    if (!resUserinfo.ok) {
      return NextResponse.json({ error: 'Failed to fetch user info' }, { status: 401 });
    }
    const profile = await resUserinfo.json();

    const email = profile.email;
    const name = profile.name || (profile.email ? profile.email.split('@')[0] : 'user');
    const auth0Id = profile.sub;

    if (!email) {
      return NextResponse.json({ error: 'Email unavailable in user profile' }, { status: 400 });
    }

    // 5) Find or create the user in the database
    const existingUser = await prisma.user.findUnique({ where: { email } });
    const user = existingUser ?? (await prisma.user.create({ data: { email, name, auth0Id } }));

    return NextResponse.json({ ok: true, userId: user.id });
  } catch (e) {
    console.error("Authentication or database error:", e);
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}