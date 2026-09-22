export type QuestionType =
  | "text"
  | "paragraph"
  | "single_choice"
  | "multiple_choice"
  | "dropdown"
  | "scale"
  | "rating"
  | "number"
  | "date"
  | "time"
  | "datetime"
  | "email"
  | "phone"
  | "url"
  | "file"
  | "matrix"
  | "ranking"
  | "signature"
  | "section"
  | "static";

export interface QuestionValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  customErrorMessage?: string;
}

export interface ConditionalRule {
  targetQuestionId: string;
  operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than";
  value: string;
  action: "show" | "hide" | "jump_to_section";
  jumpTargetSectionId?: string;
}

export interface QuestionConfig {
  id: string;
  type: QuestionType;
  label: string;
  description?: string;
  options?: string[]; // for choice, dropdown, matrix, ranking
  required?: boolean;
  placeholder?: string;
  defaultValue?: string | number;
  validation?: QuestionValidation;
  conditionalLogic?: ConditionalRule[];
  order: number;
}

export interface FormTheme {
  fontFamily: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  borderRadius: string;
  shadow: string;
  backgroundMediaUrl?: string;
  customCss?: string;
  logoUrl?: string;
  logoPosition?: "left" | "center" | "right";
  watermark?: {
    text?: string;
    imageUrl?: string;
    opacity: number;
    rotation: number;
    applyToCertificate?: boolean;
  };
}

export interface CertificatePlaceholder {
  id: string;
  type: "static" | "variable" | "system_date" | "system_code" | "qr_code";
  text?: string; // static text or prefix/suffix
  fieldId?: string; // for variable binding to form question
  fallbackText?: string;
  prefix?: string;
  suffix?: string;
  x: number; // percentage offset 0..100
  y: number; // percentage offset 0..100
  fontSize: number;
  fontWeight?: "normal" | "bold" | "600" | "700";
  color: string;
  align?: "left" | "center" | "right";
}

export interface FormWithDetails {
  id: string;
  ownerId: string;
  title: string;
  description?: string | null;
  status: "draft" | "live" | "closed";
  schemaJson: string;
  themeJson: string;
  openAt?: Date | null;
  closeAt?: Date | null;
  responseLimit?: number | null;
  requireLogin: boolean;
  captchaEnabled: boolean;
  allowSaveResume: boolean;
  languageVariantsJson?: string | null;
  questions: QuestionConfig[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ResponseWithDetails {
  id: string;
  formId: string;
  respondentEmail?: string | null;
  answers: Record<string, any>;
  submittedAt: Date;
  status: "pending" | "approved" | "rejected";
  certificate?: {
    id: string;
    verificationCode: string;
    pdfUrl: string;
  } | null;
}
