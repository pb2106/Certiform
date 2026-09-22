import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const responses = await prisma.response.findMany({
      where: { formId: params.id },
      orderBy: { submittedAt: "desc" },
      include: {
        issuedCertificates: true,
        fileUploads: true,
      },
    });

    return NextResponse.json(responses);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { responseId, status } = body;

    if (!responseId || !status) {
      return NextResponse.json({ error: "responseId and status are required" }, { status: 400 });
    }

    const updatedResponse = await prisma.response.update({
      where: { id: responseId },
      data: { status },
    });

    return NextResponse.json(updatedResponse);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
