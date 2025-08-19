import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify, createRemoteJWKSet } from "jose";

const API_AUDIENCE = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE;

async function jwksFrom(issuer) {
  return createRemoteJWKSet(
    new URL(`${issuer.replace(/\/$/, "")}/.well-known/jwks.json`)
  );
}

// POST handler for user authentication and creation
export async function POST(req) {
  try {
    // 1) Get the access token from the Authorization header
    const auth = req.headers.get("authorization") || "";
    const accessToken = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!accessToken) {
      return NextResponse.json(
        { error: "Missing access token" },
        { status: 401 }
      );
    }

    // 2) Extract the issuer from the access token to get the correct JWKS
    const parts = accessToken.split(".");
    if (parts.length !== 3) {
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 401 }
      );
    }
    const accessPreview = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf8")
    );
    const iss = accessPreview.iss;

    // 3) Verify the access token against your API audience
    const accessJwks = await jwksFrom(iss);
    await jwtVerify(accessToken, accessJwks, {
      issuer: iss,
      audience: API_AUDIENCE,
    });

    // 4) Parse the request body to get user data
    const body = await req.json();
    const email = body.email;
    const name = body.name;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required in request body" },
        { status: 400 }
      );
    }

    // 5) Verify that email in token matches email in body for security
    if (accessPreview.email && accessPreview.email !== email) {
      return NextResponse.json(
        { error: "Email in token does not match email in request body" },
        { status: 401 }
      );
    }

    // 6) Upsert user with provided data
    const user = await prisma.user.upsert({
      where: { email },
      create: { name, email },
      update: { name },
    });

    return NextResponse.json({ user });
  } catch (e) {
    console.error("Authentication or database error:", e);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}


// GET handler to get the current user
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        courses: {
          include: { assignments: true },
        },
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
