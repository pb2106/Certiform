import { z } from "zod";
import { QuestionConfig } from "./types";

export function generateZodSchema(questions: QuestionConfig[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  questions.forEach((q) => {
    if (q.type === "section" || q.type === "static") {
      return; // static sections do not carry answer values
    }

    let fieldSchema: z.ZodTypeAny;

    switch (q.type) {
      case "email":
        fieldSchema = z.string().email({ message: "Please enter a valid email address" });
        break;

      case "number":
      case "scale":
      case "rating":
        fieldSchema = z.coerce.number();
        if (q.validation?.min !== undefined) {
          fieldSchema = (fieldSchema as z.ZodNumber).min(q.validation.min, {
            message: `Value must be at least ${q.validation.min}`,
          });
        }
        if (q.validation?.max !== undefined) {
          fieldSchema = (fieldSchema as z.ZodNumber).max(q.validation.max, {
            message: `Value must be at most ${q.validation.max}`,
          });
        }
        break;

      case "url":
        fieldSchema = z.string().url({ message: "Please enter a valid URL (e.g. https://...)" });
        break;

      case "multiple_choice":
      case "matrix":
      case "ranking":
        fieldSchema = z.array(z.string());
        if (q.required) {
          fieldSchema = (fieldSchema as z.ZodArray<z.ZodString>).min(1, {
            message: "Please select at least one option",
          });
        }
        break;

      default:
        fieldSchema = z.string();
        if (q.validation?.minLength !== undefined) {
          fieldSchema = (fieldSchema as z.ZodString).min(q.validation.minLength, {
            message: `Must be at least ${q.validation.minLength} characters`,
          });
        }
        if (q.validation?.maxLength !== undefined) {
          fieldSchema = (fieldSchema as z.ZodString).max(q.validation.maxLength, {
            message: `Cannot exceed ${q.validation.maxLength} characters`,
          });
        }
        if (q.validation?.pattern) {
          try {
            const regex = new RegExp(q.validation.pattern);
            fieldSchema = (fieldSchema as z.ZodString).regex(regex, {
              message: q.validation.customErrorMessage || "Invalid input format",
            });
          } catch (e) {
            // invalid regex fallback
          }
        }
        break;
    }

    if (!q.required) {
      fieldSchema = fieldSchema.optional().or(z.literal(""));
    } else {
      if (q.type !== "multiple_choice" && q.type !== "matrix" && q.type !== "ranking") {
        fieldSchema = (fieldSchema as z.ZodString).min(1, {
          message: q.validation?.customErrorMessage || `${q.label} is required`,
        });
      }
    }

    shape[q.id] = fieldSchema;
  });

  return z.object(shape);
}
