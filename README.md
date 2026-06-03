# Converto — Universal File Converter

Convert anything, to anything. **Next.js 16** platform supporting **68+ format conversions** with zero file retention. Features a **dual architecture**: client-side conversions run entirely in your browser, while complex conversions use server-side professional engines.

---

## Features

- **68+ Conversion Formats** — PDF, DOCX, PPTX, XLSX, images (JPG, PNG, WEBP, HEIC, AVIF, GIF), TXT, HTML, MD, CSV, JSON, XML, ZIP, ODT, ODS and more
- **Dual Processing Architecture** — Tier 1 conversions (images, text, DOCX->TXT, XLSX->CSV/JSON) run in your browser using Canvas, WASM, and JavaScript. No upload required.
- **Server-Side Engine** — LibreOffice, Camelot (table extraction), OCRmyPDF, pdf-lib for complex conversions
- **Async Processing** — Celery + Redis for background conversion jobs with real-time status polling
- **Privacy First** — Zero-retention policy. Files processed in-memory, purged after conversion. Browser-mode files never leave your device.
- **Dark/Light Theme** — Smooth transitions with persistent preference
- **Responsive UI** — Mobile-first with Framer Motion animations
- **Developer Links** — Quick access to LinkedIn, GitHub, Discord, Email, and Website

---

## Tech Stack

**Frontend**
- [Next.js 16.2.6](https://nextjs.org/) (App Router)
- [React 19.2](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Framer Motion](https://motion.dev/) — animations
- [Lucide React](https://lucide.dev/) — icons
- [Zod](https://zod.dev/) — schema validation

**Backend**
- [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10)
- [Celery](https://docs.celeryq.dev/) — async task queue
- [Redis](https://redis.io/) — message broker & result backend
- [LibreOffice](https://www.libreoffice.org/) — headless document rendering
- [Gotenberg 8](https://gotenberg.dev/) — PDF generation service
- [Pandoc](https://pandoc.org/) — document format conversion
- Tesseract OCR + EasyOCR — optical character recognition
- pdfplumber / Camelot — PDF table extraction
- Pillow / Sharp / libheif — image processing

**Client-Side Libraries**
- [pdf-lib](https://pdf-lib.js.org/) — PDF manipulation in browser
- [libheif-js](https://github.com/strukturag/libheif) — HEIC decoding
- [gif.js](https://github.com/jnordberg/gif.js) — GIF encoding
- [avif-wasm](https://github.com/nickkuk/avif-wasm) — AVIF encoding

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (optional — needed for backend services)
- [Git](https://git-scm.com/)

### Setup

```bash
# Clone the repository
git clone https://github.com/sougandhhhhh/Converto.git
cd converto

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)**

> Many formats convert in-browser without any backend. For server-side conversions, start Docker services.

### With Backend (Docker)

```bash
# Start backend services (Docker required)
docker compose up -d

npm run dev
```

---

## Deployment

Converto is deployed on **Vercel** with optional backend on **Render**:

| Component | Platform | Service |
|-----------|----------|---------|
| Frontend (Next.js) | Vercel | converto2026.vercel.app |
| Backend API (FastAPI) | Render | `backend` |
| Celery Worker | Render | `worker` |
| PDF Engine (Gotenberg) | Hugging Face Spaces | Docker Space |
| Redis | Render | `redis` |

---

## Project Structure

```
src/
  app/           Next.js App Router pages & API routes
  components/    Shared UI components (Navbar, Footer, ThemeProvider)
  hooks/         Custom React hooks
  lib/           Utility functions
  server/        tRPC server logic

backend/
  Dockerfile         FastAPI server image
  Dockerfile.worker  Celery worker image
  requirements.txt   Python dependencies
  app/
    main.py          FastAPI entrypoint
    api/routes.py    REST endpoints
    engine/          Conversion pipeline handlers (PDF, Office, Image, Text)
    tasks.py         Celery background tasks
    utils/           File management & validation
```

---

## Environment Variables

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
```

---

## License

MIT
