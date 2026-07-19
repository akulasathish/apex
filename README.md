# ApexTech Software Institute - Website & Certificate Registry

This is the official Next.js portal for **ApexTech Software Institute**, featuring the landing page, curriculum details, enquiry contact forms, and a secure certificate verification registry.

---

## 🚀 Architecture & Tech Stack

The application has been fully migrated to Vercel native cloud services to eliminate Google Cloud Platform (GCP) dependencies, billing requirements, and serverless size constraints.

1. **Frontend**: Next.js (App Router, Tailwind CSS, Server Actions).
2. **Database**: **Vercel Postgres** (managed database storing certificate registries and contact leads).
3. **File Storage**: **Vercel Blob** (secure cloud storage for student profile photos and compiled PDF files).
4. **Certificate Compiler**: Pure JavaScript **`pdf-lib` + `qrcode`** pipeline (compiles custom overlay certificate PDFs with dynamic QR codes directly in serverless execution environments, removing Python dependencies).

---

## 🛠️ Database Setup

Run the following SQL queries in your **Vercel Postgres SQL Console** to set up the necessary database tables:

### 1. Certificates Registry Table
```sql
CREATE TABLE IF NOT EXISTS certificates (
    id VARCHAR(255) PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    course_title VARCHAR(255) NOT NULL,
    date_start VARCHAR(100) NOT NULL,
    date_end VARCHAR(100) NOT NULL,
    issue_date VARCHAR(100) NOT NULL,
    photo_url TEXT,
    pdf_url TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Contact Leads Table
```sql
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    course VARCHAR(255) NOT NULL,
    message TEXT,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔑 Environment Variables

To run the application locally or deploy it to Vercel, ensure these environment variables are set in your Vercel project Settings or your local `.env.local` file:

```env
# Vercel Postgres Connections
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."
POSTGRES_USER="default"
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="neondb"

# Vercel Blob Token
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```

---

## ⚙️ Core Workflows

### 1. Smart Verification Parsing
The `/verify/[...id]` route supports cross-compatible lookups. When scanned or opened, it automatically normalizes dashes (e.g. `/verify/ATS-APP-26-1014`) into slashes matching the database IDs (e.g. `ATS/APP/26/1014`).

### 2. Ephemeral Seeder Sync
To populate the database on initial startup, `getCertificates()` includes a seeder check. If the Postgres table is **completely empty**, it automatically imports the default entries from `src/data/certificates.json`. Once populated, the database becomes the single source of truth, allowing permanent deletions without database resurrection.

### 3. Pure JS PDF Rendering
The PDF generator (`src/app/actions/certificates.js`) utilizes `pdf-lib` to overlay the student name, course title, dates, profile photo, and a dynamically generated verification QR code on top of `scripts/certificate_template.jpg` using font files located in `scripts/fonts/`.

---

## 💻 Getting Started (Local Development)

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Link your Vercel project to pull environment variables:
   ```bash
   vercel link
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
