import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FormRenderer } from "@/components/FormRenderer";
import { QuestionConfig, FormTheme } from "@/lib/types";

export const revalidate = 0; // Fresh render

export default async function PublicFormPage({ params }: { params: { id: string } }) {
  const form = await prisma.form.findUnique({
    where: { id: params.id },
  });

  if (!form) {
    notFound();
  }

  const questions: QuestionConfig[] = JSON.parse(form.schemaJson || "[]");
  const theme: FormTheme = JSON.parse(form.themeJson || "{}");

  const bgStyle = theme.backgroundColor
    ? { backgroundColor: theme.backgroundColor }
    : {};

  return (
    <div className="min-h-screen py-10 px-4" style={bgStyle}>
      <FormRenderer
        formId={form.id}
        title={form.title}
        description={form.description}
        questions={questions}
        theme={theme}
      />
    </div>
  );
}
