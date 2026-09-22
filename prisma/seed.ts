import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.emailLog.deleteMany();
  await prisma.certificateIssued.deleteMany();
  await prisma.certificateTemplate.deleteMany();
  await prisma.fileUpload.deleteMany();
  await prisma.response.deleteMany();
  await prisma.question.deleteMany();
  await prisma.collaborator.deleteMany();
  await prisma.form.deleteMany();
  await prisma.user.deleteMany();

  // Create Demo Creator User
  const passwordHash = await bcrypt.hash("password123", 10);
  const user = await prisma.user.create({
    data: {
      name: "Alex Rivera",
      email: "demo@example.com",
      passwordHash,
      role: "admin",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  console.log(`Created demo user: ${user.email}`);

  // Create Form 1: Workshop Certificate & Feedback Form
  const form1Questions = [
    {
      id: "q1_fullname",
      type: "text",
      label: "Full Name (for Certificate)",
      description: "Please enter your name exactly as you wish it to appear on your official certificate.",
      required: true,
      order: 1,
    },
    {
      id: "q2_email",
      type: "email",
      label: "Email Address",
      description: "Your digital certificate will be dispatched to this email.",
      required: true,
      order: 2,
    },
    {
      id: "q3_role",
      type: "single_choice",
      label: "Your Current Role",
      optionsJson: JSON.stringify(["Software Engineer", "Product Manager", "Data Scientist", "UI/UX Designer", "Student / Researcher"]),
      required: true,
      order: 3,
    },
    {
      id: "q4_rating",
      type: "rating",
      label: "Overall Workshop Rating",
      description: "Rate your overall experience from 1 to 5 stars.",
      required: true,
      order: 4,
    },
    {
      id: "q5_key_takeaways",
      type: "paragraph",
      label: "Key Learnings & Feedback",
      description: "What were the most valuable skills or concepts you learned during the sessions?",
      required: false,
      order: 5,
    },
    {
      id: "q6_attend_next",
      type: "single_choice",
      label: "Would you like to attend the Advanced AI Architecture Masterclass?",
      optionsJson: JSON.stringify(["Yes, send me an invite", "Maybe later", "No thanks"]),
      required: true,
      order: 6,
    },
  ];

  const form1Theme = {
    fontFamily: "Inter",
    primaryColor: "#059669", // Emerald green
    backgroundColor: "#f0fdf4",
    textColor: "#0f172a",
    accentColor: "#10b981",
    borderRadius: "12px",
    shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
    watermark: {
      text: "VERIFIED CERTIFICATE FORM",
      opacity: 0.04,
      rotation: -15,
    },
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
  };

  const form1 = await prisma.form.create({
    data: {
      ownerId: user.id,
      title: "Global AI & Web Architecture Summit 2026",
      description: "Complete this quick feedback form to instantly verify your attendance and claim your verifiable digital certificate of completion.",
      status: "live",
      schemaJson: JSON.stringify(form1Questions),
      themeJson: JSON.stringify(form1Theme),
      openAt: new Date("2026-01-01"),
      closeAt: new Date("2026-12-31"),
      responseLimit: 500,
      requireLogin: false,
      captchaEnabled: false,
      allowSaveResume: true,
      questions: {
        create: form1Questions.map((q) => ({
          type: q.type,
          label: q.label,
          description: q.description,
          optionsJson: q.optionsJson,
          required: q.required,
          order: q.order,
        })),
      },
    },
  });

  console.log(`Created Form: ${form1.title}`);

  // Create Certificate Template for Form 1
  const cert1Placeholders = [
    {
      id: "title",
      type: "static",
      text: "CERTIFICATE OF COMPLETION",
      x: 50, // center percentage
      y: 20,
      fontSize: 32,
      fontWeight: "bold",
      color: "#0f172a",
    },
    {
      id: "sub",
      type: "static",
      text: "This certifies that",
      x: 50,
      y: 32,
      fontSize: 16,
      color: "#64748b",
    },
    {
      id: "name",
      type: "variable",
      fieldId: "q1_fullname",
      fallbackText: "Participant Name",
      x: 50,
      y: 45,
      fontSize: 36,
      fontWeight: "bold",
      color: "#059669",
    },
    {
      id: "desc",
      type: "static",
      text: "has successfully completed the Global AI & Web Architecture Summit 2026",
      x: 50,
      y: 60,
      fontSize: 18,
      color: "#334155",
    },
    {
      id: "date",
      type: "system_date",
      prefix: "Issued on: ",
      x: 30,
      y: 78,
      fontSize: 14,
      color: "#64748b",
    },
    {
      id: "code",
      type: "system_code",
      prefix: "Credential ID: ",
      x: 70,
      y: 78,
      fontSize: 14,
      color: "#64748b",
    },
  ];

  const template1 = await prisma.certificateTemplate.create({
    data: {
      formId: form1.id,
      name: "Official Summit Completion Certificate",
      backgroundUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80",
      placeholdersJson: JSON.stringify(cert1Placeholders),
    },
  });

  // Create Demo Responses & Certificates
  const demoRespondents = [
    { name: "Sophia Chen", email: "sophia.chen@example.com", role: "Software Engineer", rating: "5", takeaways: "Loved the deep dive into Next.js App Router and edge function optimization." },
    { name: "Marcus Vance", email: "marcus.vance@example.com", role: "Product Manager", rating: "5", takeaways: "Exceptional presentation on AI integrations and certificate workflows." },
    { name: "Elena Rostova", email: "elena.r@example.com", role: "Data Scientist", rating: "4", takeaways: "Very helpful hands-on walkthroughs." },
    { name: "David Kim", email: "dkim@example.com", role: "UI/UX Designer", rating: "5", takeaways: "Great breakdown of dynamic canvas styling and micro-animations." },
    { name: "Amara Okonjo", email: "amara.o@example.com", role: "Software Engineer", rating: "5", takeaways: "Clear, concise, and highly practical." },
  ];

  for (let i = 0; i < demoRespondents.length; i++) {
    const resp = demoRespondents[i];
    const answers = {
      q1_fullname: resp.name,
      q2_email: resp.email,
      q3_role: resp.role,
      q4_rating: resp.rating,
      q5_key_takeaways: resp.takeaways,
      q6_attend_next: "Yes, send me an invite",
    };

    const response = await prisma.response.create({
      data: {
        formId: form1.id,
        respondentEmail: resp.email,
        answersJson: JSON.stringify(answers),
        status: "approved",
        submittedAt: new Date(Date.now() - i * 3600000 * 4),
      },
    });

    const certCode = `CERT-SUMMIT-2026-00${i + 1}`;
    await prisma.certificateIssued.create({
      data: {
        responseId: response.id,
        templateId: template1.id,
        pdfUrl: `/api/certificates/render?code=${certCode}`,
        verificationCode: certCode,
        issuedAt: new Date(),
      },
    });

    await prisma.emailLog.create({
      data: {
        responseId: response.id,
        type: "certificate_issued",
        status: "sent",
      },
    });
  }

  console.log("Database seeded successfully with demo forms, templates, responses & certificates!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
