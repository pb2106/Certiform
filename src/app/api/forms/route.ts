import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const forms = await prisma.form.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { responses: true, certificateTemplates: true },
        },
      },
    });
    return NextResponse.json(forms);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description } = body;

    // Get default admin user or create one
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: "Form Creator",
          email: "creator@example.com",
          role: "admin",
        },
      });
    }

    const defaultQuestions = [
      {
        id: "q1_fullname",
        type: "text",
        label: "Full Name",
        description: "Your full name for verification and certificate issuance",
        required: true,
        order: 1,
      },
      {
        id: "q2_email",
        type: "email",
        label: "Email Address",
        description: "We will send your confirmation and certificate to this email",
        required: true,
        order: 2,
      },
      {
        id: "q3_rating",
        type: "rating",
        label: "How would you rate your experience?",
        required: true,
        order: 3,
      },
    ];

    const defaultTheme = {
      fontFamily: "Inter",
      primaryColor: "#059669",
      backgroundColor: "#ffffff",
      textColor: "#0f172a",
      accentColor: "#10b981",
      borderRadius: "12px",
      shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
    };

    const newForm = await prisma.form.create({
      data: {
        ownerId: user.id,
        title: title || "Untitled Dynamic Form",
        description: description || "Form description and instructions",
        status: "draft",
        schemaJson: JSON.stringify(defaultQuestions),
        themeJson: JSON.stringify(defaultTheme),
        questions: {
          create: defaultQuestions.map((q) => ({
            type: q.type,
            label: q.label,
            description: q.description,
            required: q.required,
            order: q.order,
          })),
        },
      },
    });

    // Create default certificate template
    const defaultPlaceholders = [
      { id: "title", type: "static", text: "CERTIFICATE OF PARTICIPATION", x: 50, y: 20, fontSize: 30, fontWeight: "bold", color: "#0f172a" },
      { id: "sub", type: "static", text: "This certifies that", x: 50, y: 34, fontSize: 16, color: "#64748b" },
      { id: "name", type: "variable", fieldId: "q1_fullname", fallbackText: "Participant Name", x: 50, y: 46, fontSize: 34, fontWeight: "bold", color: "#059669" },
      { id: "desc", type: "static", text: `has successfully submitted entries for ${newForm.title}`, x: 50, y: 60, fontSize: 16, color: "#334155" },
      { id: "date", type: "system_date", prefix: "Date: ", x: 30, y: 78, fontSize: 14, color: "#64748b" },
      { id: "code", type: "system_code", prefix: "Verification ID: ", x: 70, y: 78, fontSize: 14, color: "#64748b" },
    ];

    await prisma.certificateTemplate.create({
      data: {
        formId: newForm.id,
        name: "Standard Completion Certificate",
        placeholdersJson: JSON.stringify(defaultPlaceholders),
      },
    });

    return NextResponse.json(newForm, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
