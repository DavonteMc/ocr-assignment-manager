import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify, createRemoteJWKSet } from "jose";

const API_AUDIENCE = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE;

async function jwksFrom(issuer) {
  return createRemoteJWKSet(
    new URL(`${issuer.replace(/\/$/, "")}/.well-known/jwks.json`)
  );
}

async function verifyToken(req) {
  const auth = req.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer "))
    throw new Error("Missing or invalid authorization header");
  const token = auth.slice(7);
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid token format");
  const accessPreview = JSON.parse(
    Buffer.from(parts[1], "base64url").toString("utf8")
  );
  const iss = accessPreview.iss;
  const accessJwks = await jwksFrom(iss);
  await jwtVerify(token, accessJwks, { issuer: iss, audience: API_AUDIENCE });
  return { token, accessPreview };
}

export async function POST(req) {
  try {
    await verifyToken(req);
    const body = await req.json();
    const { courseName, userEmail } = body;

    if (!courseName || !userEmail) {
      return NextResponse.json({ error: "Missing courseName or userEmail" }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: {
        courseName,
        userId: userEmail,  // Correct field to link user by email
      },
      select: {
        id: true,
        courseName: true,
      },
    });

    return NextResponse.json({ course });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}


// Update course handler
export async function PATCH(req) {
  try {
    // Auth Section: Verify access token
    await verifyToken(req);

    // Course Update Section: Parse request body
    const body = await req.json();
    const { courseId, courseName } = body;

    if (!courseId || !courseName) {
      return NextResponse.json(
        { error: "courseId and courseName are required" },
        { status: 400 }
      );
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: { courseName },
    });

    // Optionally return updated course or confirmation
    return NextResponse.json({ updatedCourse });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

// Delete course handler
export async function DELETE(req) {
  try {
    // Auth Section: Verify access token
    await verifyToken(req);

    // Course Deletion Section: Parse query parameters
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { error: "courseId query parameter required" },
        { status: 400 }
      );
    }

    await prisma.course.delete({
      where: { id: courseId },
    });

    return NextResponse.json({ message: "Course deleted" });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
