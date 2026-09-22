import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const form = await prisma.form.findUnique({
      where: { id: params.id },
      include: {
        certificateTemplates: true,
        _count: {
          select: { responses: true },
        },
      },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json(form);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { title, description, status, schemaJson, themeJson, openAt, closeAt, responseLimit, requireLogin, captchaEnabled, certificateTemplate } = body;

    const updatedForm = await prisma.form.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(schemaJson !== undefined && { schemaJson }),
        ...(themeJson !== undefined && { themeJson }),
        ...(openAt !== undefined && { openAt: openAt ? new Date(openAt) : null }),
        ...(closeAt !== undefined && { closeAt: closeAt ? new Date(closeAt) : null }),
        ...(responseLimit !== undefined && { responseLimit }),
        ...(requireLogin !== undefined && { requireLogin }),
        ...(captchaEnabled !== undefined && { captchaEnabled }),
      },
    });

    if (certificateTemplate) {
      const existingTemplate = await prisma.certificateTemplate.findFirst({
        where: { formId: params.id },
      });

      if (existingTemplate) {
        await prisma.certificateTemplate.update({
          where: { id: existingTemplate.id },
          data: {
            name: certificateTemplate.name || existingTemplate.name,
            backgroundUrl: certificateTemplate.backgroundUrl,
            placeholdersJson: certificateTemplate.placeholdersJson,
          },
        });
      } else {
        await prisma.certificateTemplate.create({
          data: {
            formId: params.id,
            name: certificateTemplate.name || "Default Certificate",
            backgroundUrl: certificateTemplate.backgroundUrl,
            placeholdersJson: certificateTemplate.placeholdersJson,
          },
        });
      }
    }

    return NextResponse.json(updatedForm);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.form.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Form deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
