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
    // Parse request body
    const body = await req.json();

    // Bulk creation: body contains "assignments" array and "courseId"
    if (
      body.courseId &&
      Array.isArray(body.assignments) &&
      body.assignments.length > 0
    ) {
      const assignmentsData = body.assignments.map((assignment) => ({
        title: assignment.title,
        dueDate: assignment.dueDate ? new Date(assignment.dueDate) : null,
        completed: assignment.completed ?? false,
        courseId: body.courseId,
      }));

      await prisma.assignment.createMany({
        data: assignmentsData,
        skipDuplicates: true, // optional
      });

      return NextResponse.json({ message: "Assignments created" });
    }

    // Single assignment creation: expect these fields in body
    const { courseId, title, dueDate, completed } = body;
    if (!courseId || !title || typeof completed !== "boolean") {
      return NextResponse.json(
        { error: "Missing fields for single assignment creation" },
        { status: 400 }
      );
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        dueDate: dueDate ? new Date(dueDate) : null,
        completed,
        course: { connect: { id: courseId } },
      },
    });

    return NextResponse.json({ assignment });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Failed to add assignment" },
      { status: 401 }
    );
  }
}

export async function PATCH(req) {
  try {
    await verifyToken(req);
    const body = await req.json();
    const { assignmentId, title, dueDate, completed } = body;
    console.log("PATCH /api/assignments body:", body);
    if (!assignmentId || !title || typeof completed !== "boolean") {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const parsedDueDate = dueDate ? new Date(dueDate) : null;
    if (dueDate && isNaN(parsedDueDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid dueDate format" },
        { status: 400 }
      );
    }

    const updatedAssignment = await prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        title,
        dueDate: parsedDueDate,
        completed,
      },
    });
    return NextResponse.json({ updatedAssignment });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Failed to update assignment" },
      { status: 401 }
    );
  }
}

export async function DELETE(req) {
  try {
    await verifyToken(req);
    const { searchParams } = new URL(req.url);
    const assignmentId = searchParams.get("assignmentId");
    if (!assignmentId)
      return NextResponse.json(
        { error: "assignmentId required" },
        { status: 400 }
      );
    await prisma.assignment.delete({ where: { id: assignmentId } });
    return NextResponse.json({ message: "Assignment deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Failed to delete assignment" },
      { status: 401 }
    );
  }
}
