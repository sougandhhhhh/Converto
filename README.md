# 🌌 Converto — Universal File Converter

Convert anything, to anything. **Next.js 16** + **FastAPI** powered platform supporting **68+ format conversions** with zero file retention. 🚀

---

## ✨ Features

- **📄 68+ Conversion Formats** — PDF, DOCX, PPTX, XLSX, images (JPG, PNG, WEBP, HEIC, AVIF, GIF), TXT, HTML, MD, CSV, JSON, XML, ZIP, ODT, ODS and more
- **⚙️ Async Processing** — Celery + Redis for background conversion jobs with real-time status polling
- **🔬 Rich PDF Engine** — pdfplumber, Camelot (table extraction), pdftoppm, muPDF, OCRmyPDF, python-docx, python-pptx
- **🏢 Office Suite** — LibreOffice headless for Office-to-anything transformations
- **🖼️ Image Processing** — Pillow, ImageMagick, Sharp, HEIC/AVIF transcoding, Tesseract + EasyOCR
- **📝 Text & Markdown** — Pandoc-powered conversion between TXT, MD, HTML, PDF, DOCX, CSV, JSON, XML
- **🔒 Privacy First** — Zero-retention policy. Files processed in-memory, purged after conversion
- **🌓 Dual Theme** — Light and dark mode with smooth transitions and persistent preference
- **📱 Responsive UI** — Mobile-first with Framer Motion animations and shadcn/ui components
- **🔗 tRPC + React Query** — End-to-end type-safe API calls with automatic caching
- **🐳 Docker Orchestration** — Compose setup with Redis, FastAPI backend, Celery worker, and Gotenberg

---

## 🛠️ Tech Stack

**🎨 Frontend**
- [Next.js 16.2.6](https://nextjs.org/) (App Router, Turbopack)
- [React 19.2](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Framer Motion](https://motion.dev/) — animations
- [tRPC 11](https://trpc.io/) + [TanStack React Query 5](https://tanstack.com/query) — API layer
- [Lucide React](https://lucide.dev/) — icons
- [shadcn/ui](https://ui.shadcn.com/) — component primitives
- [Zod](https://zod.dev/) — schema validation

**⚡ Backend**
- [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10)
- [Celery](https://docs.celeryq.dev/) — async task queue
- [Redis](https://redis.io/) — message broker & result backend
- [LibreOffice](https://www.libreoffice.org/) — headless document rendering
- [Gotenberg 8](https://gotenberg.dev/) — PDF generation service
- [Pandoc](https://pandoc.org/) — document format conversion
- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract) + [EasyOCR](https://github.com/JaidedAI/EasyOCR) — optical character recognition
- [pdfplumber](https://github.com/jsvine/pdfplumber) / [Camelot](https://camelot-py.readthedocs.io/) — PDF table extraction
- [Pillow](https://pillow.readthedocs.io/) / [Sharp](https://sharp.pixelplumbing.com/) — image processing
- [ImageMagick](https://imagemagick.org/) — image transcoding
- [python-docx](https://python-docx.readthedocs.io/) / [python-pptx](https://python-pptx.readthedocs.io/) / [openpyxl](https://openpyxl.readthedocs.io/) — Office file manipulation

**🏗️ Infrastructure**
- [Docker Compose](https://docs.docker.com/compose/) — local development (Redis, backend, worker, Gotenberg)
- [Cloudflare R2 / AWS S3](https://aws.amazon.com/s3/) — optional file storage for large uploads

---

## 🌐 Backend API Endpoints

| Method | Path | Description |
| :--- | :--- | :--- |
| 📤 POST | `/api/upload` | Upload a file (validates size & extension) |
| 🔄 POST | `/api/convert` | Submit a conversion job |
| 📊 GET | `/api/status/{task_id}` | Poll conversion status |
| 📥 GET | `/api/download/{task_id}` | Download the converted file |
| 🧹 POST | `/api/cleanup` | Trigger file garbage collection |

---

## 🚀 Getting Started

### 📋 Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (optional — needed for backend services)
- [Git](https://git-scm.com/)

### 🛠️ Setup

```bash
# Clone the repository
git clone https://github.com/sougandhhhhh/Converto.git
cd converto

# Install frontend dependencies
npm install

# Start backend services (Docker required)
docker compose up -d

# Run the development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** 🎉

> **💡 Windows users**: Run `startconverto.bat` to start both Docker services and the Next.js dev server with one click.

### 🏝️ Without Docker

No Docker? No problem. Converto runs in sandbox mode — the frontend works fully, conversions fall back gracefully:

```bash
npm run dev
```

---

## 🔐 Environment Variables

```env
# Gotenberg rendering engine URL
GOTENBERG_URL=http://localhost:3020
NEXT_PUBLIC_GOTENBERG_URL=http://localhost:3020

# Redis (for Celery backend)
REDIS_URL=redis://localhost:6379/0

# File storage limits
UPLOAD_DIR=/tmp/converto/uploads
OUTPUT_DIR=/tmp/converto/outputs
MAX_FILE_SIZE_MB=50
FILE_RETENTION_MINUTES=30

# Cloudflare R2 / AWS S3 (optional, for uploads >4.5MB)
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY=your_access_key
R2_SECRET_KEY=your_secret_key
R2_BUCKET=your_bucket_name
```

---

## 🐳 Docker Services

```yaml
redis:     # 📦 Redis 7 Alpine — Celery broker
backend:   # ⚡ FastAPI server (port 8000)
worker:    # 🔄 Celery worker (concurrency=4)
gotenberg: # 📄 Gotenberg 8 (port 3020 → 3000)
```

```bash
# Start all services
docker compose up -d

# Start only Gotenberg (quick PDF testing)
npm run gotenberg
```

---

## 🌍 Deployment

Converto is designed for **[Vercel](https://vercel.com/)** (frontend) + **[Koyeb](https://www.koyeb.com/)** (Gotenberg backend):

```bash
# Deploy backend to Koyeb
koyeb deploy -f koyeb.yaml
```

Set `GOTENBERG_URL` in your Vercel dashboard to point to your Koyeb Gotenberg instance.

---

## 📂 Project Structure

```
src/
  app/           🌐 Next.js App Router pages & API routes
  components/    🧩 Shared UI components (Navbar, Footer, ThemeProvider)
  hooks/         🪝 Custom React hooks
  lib/           🔧 Utility functions
  server/        🔗 tRPC server logic

backend/
  Dockerfile         🐳 FastAPI server image
  Dockerfile.worker  🐳 Celery worker image
  requirements.txt   📦 Python dependencies
  app/
    main.py          🚀 FastAPI entrypoint
    api/routes.py    🌐 REST endpoints
    engine/          ⚙️ Conversion pipeline handlers (PDF, Office, Image, Text)
    tasks.py         🔄 Celery background tasks
    utils/           🛠️ File management & validation
```

---

## 📄 License

MIT
