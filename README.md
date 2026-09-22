# CertiForm.ai — Dynamic Form Builder & Certificate Automation Platform

> A production-grade enterprise platform built on Next.js 14 (App Router), Prisma ORM, Auth.js / NextAuth, Tailwind CSS, `@dnd-kit`, Satori/HTML rendering engine, and Recharts. Engineered specifically for Vercel serverless deployment.

---

## 🌟 Key Features & Capabilities

### 🎨 1. Dynamic Drag-and-Drop Form Builder
- **20+ Question Types**: Short Text, Long Paragraph, Single Choice, Checkboxes, Dropdown, Star Rating, Number, Email, Phone, Website URL, Date Picker, Time, Section Breaks, Static Content Blocks, and Signature Pads.
- **`@dnd-kit` Powered**: Smooth drag-and-drop question reordering with live canvas feedback.
- **Runtime Validation**: Dynamic Zod schema compiler (`zod`) ensuring both client-side and server-side input validation.
- **Conditional Branching & Logic**: Show/Hide questions or skip sections based on prior user responses.
- **Multi-Page Pagination**: Progressive step navigation with dynamic progress bars.

### 🎨 2. Free-Form Styling & Theme Engine
- **Google Fonts Integration**: Live typography picker (Inter, Roboto, Outfit, Playfair Display, Fira Code).
- **Custom Color Palettes**: Pick primary, accent, and background colors with HSL/HEX inputs.
- **Watermark & Security**: Dynamic text watermarks with opacity and rotation controls.
- **Logo Upload Slot**: Resizable, repositionable logo branding.
- **Corner Rounding & Shadows**: Customizable card radii and elevation presets.

### 📜 3. Visual Certificate Generator & Verification Portal
- **Visual Template Designer**: Upload custom background certificate graphics and place draggable placeholders.
- **Dynamic Variable Bindings**: Bind certificate text directly to form answer fields (`{{fullname}}`), issue date stamps, custom creator text, and static headers.
- **QR Code Verification Badge**: Auto-generated QR code linking directly to public verification pages.
- **Public Verification Portal (`/verify/[code]`)**: Authenticated credential badge displaying recipient name, issue date, program details, and embedded live certificate preview.
- **High-Performance Rendering**: SVG / HTML / PDF certificate rendering engine.

### 📊 4. Analytics, Spreadsheet Data Grid & Bulk Exports
- **Google-Forms-Style Visual Analytics**: Recharts bar charts for choice questions, pie charts for rating distributions, and text response aggregations.
- **Spreadsheet Grid**: Interactive table with column sorting, status filtering (Approved / Rejected), and global search.
- **Status Workflows**: Manual or automatic response approval gates before certificate release.
- **One-Click Exports**:
  - **CSV**: Clean tabular dataset export.
  - **Excel (`.xlsx`)**: Formatted spreadsheet export with auto-width headers.
  - **Certificates ZIP**: Bulk archive package containing all issued digital certificates.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14+ (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS + CSS Variables design tokens
- **Database & ORM**: Prisma ORM with SQLite (`dev.db`) for instant zero-config local dev and PostgreSQL support (Neon/Supabase) for production
- **Form State**: `@dnd-kit/core`, `@dnd-kit/sortable`, `react-hook-form`, `zod`
- **Charts & Grid**: `recharts` and custom interactive data grid
- **File & Export Processing**: `xlsx`, `jszip`, `nodemailer`, Resend API integration

---

## 🚀 Quick Start Guide: How to Run

### Prerequisites
- **Node.js**: v18.x or v20.x installed
- **npm** or **yarn** / **pnpm**

### Step 1: Install Dependencies
```bash
npm install --legacy-peer-deps
```

### Step 2: Set Up Environment Variables
The repository includes a pre-configured `.env` file for local development:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="super-secret-key-change-in-production-12345678"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
RESEND_API_KEY=""
```

### Step 3: Initialize Database & Seed Demo Data
Push the Prisma schema to generate the local SQLite database (`dev.db`) and populate it with sample forms, certificate templates, responses, and issued credentials:
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### Step 4: Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎯 What to Do (User Guide & Workflow)

### 1. Explore Pre-Populated Demo Content
- **Landing Page**: Visit `http://localhost:3000` to view the feature overview and hero section.
- **Forms Dashboard**: Visit `http://localhost:3000/dashboard` to see seeded forms (e.g. *Global AI & Web Architecture Summit 2026*).
- **Public Verification Demo**: Visit `http://localhost:3000/verify/CERT-SUMMIT-2026-001` to view an authenticated digital certificate.

### 2. Create & Build a Form
1. Click **Create Form** on the navigation header or dashboard (`/builder/new`).
2. Enter your form title and description, then click **Launch Builder Workspace**.
3. In the **Canvas Builder** tab:
   - Drag and drop questions from the left toolbar onto the canvas.
   - Click any question to configure labels, placeholder text, required flags, and options in the right **Inspector**.
4. In the **Theme Styling** tab:
   - Customize fonts, primary colors, background colors, and watermark opacity.
5. In the **Certificate Specs** tab:
   - Set up dynamic text placeholders and bind them to form questions (e.g., binding recipient name to `q1_fullname`).

### 3. Test Public Form Submission & Certificate Issuance
1. Click **Public Link** in the top right of the builder or navigate to `/f/[formId]`.
2. Fill out the form fields and submit.
3. Upon submission, a confirmation screen will appear displaying your **Verifiable Credential Code** and a direct link to view your generated certificate!

### 4. Manage Responses & Export Data
1. Return to the Builder workspace (`/builder/[formId]`) and switch to the **Responses** tab.
2. Filter responses, search entries, or toggle approval statuses.
3. Use the export buttons to download **CSV**, **Excel (.xlsx)**, or **Certificates ZIP**.
4. Switch to the **Analytics** tab to view auto-generated visual Recharts charts.

---

## 🌐 API Routes Overview

- `GET /api/forms` — Fetch form list
- `POST /api/forms` — Create a new form
- `GET /api/forms/[id]` — Fetch form details, theme, and certificate templates
- `PUT /api/forms/[id]` — Update form schema, theme, status, or certificate specs
- `POST /api/forms/[id]/submit` — Submit form response, run Zod validation, issue certificate, and trigger email notification
- `GET /api/forms/[id]/responses` — Fetch form responses and file uploads
- `GET /api/forms/[id]/export?format=csv|excel|certificates_zip` — Download response exports
- `GET /api/certificates/render?code=[code]` — Render responsive HTML certificate graphic
- `GET /api/verify/[code]` — Verify credential authenticity and metadata

---

## ⚡ Deployment to Vercel

1. Push your code to a GitHub repository.
2. Import the project into your **Vercel Dashboard**.
3. Set environment variables in Vercel settings:
   - `DATABASE_URL`: Your Neon/Supabase PostgreSQL connection string
   - `NEXTAUTH_SECRET`: A secure random string
   - `NEXT_PUBLIC_APP_URL`: Your Vercel production domain
4. Deploy! Next.js App Router and Prisma will generate serverless API routes automatically.
