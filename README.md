# 🌌 CONVERTO — Universal File Converter

CONVERTO is a premium, state-of-the-art, and responsive universal file conversion dashboard. Engineered using Next.js 16 App Router, Tailwind CSS, and optimized serverless processing, it delivers high-performance conversions for documents, sheets, and images while maintaining a strict zero-retention privacy protocol.

---

## ✨ Features

* **⚡ Real-time Multi-Format Conversions**: Seamlessly convert documents (DOCX, PPTX, XLSX, TXT) and high-resolution images (HEIC, JPG, PNG, WEBP, AVIF, GIF).
* **🌓 Dual Theme Experience**: Smooth animations and micro-interactions optimized for both vibrant light and sleek dark modes.
* **🛡️ Zero-Retention Privacy**: Conversions occur entirely in-memory or are streamed via secure, temporary pre-signed Cloudflare R2/S3 storage URLs, ensuring no files are permanently stored on servers.
* **📦 Local Sandbox Fallback**: If external rendering engines are offline during local testing, Converto gracefully falls back to a sandbox environment to output a detailed preview card with logs instead of crashing.
* **🐳 Scalable Gotenberg Integration**: Fully compatible with Docker-based Gotenberg instances for high-fidelity LibreOffice and Chromium document rendering.

---

## 📊 Supported Conversion Mappings

| Source Format | Target Format(s) | Rendering Layer | Description |
| :--- | :--- | :--- | :--- |
| **XLSX** | PDF, CSV, TXT, HTML, DOCX, JSON, XML, ZIP | Gotenberg / Structured Script | Full workbook processing |
| **TXT** | PDF, DOCX, HTML, CSV, JSON, XML | Gotenberg / Structured Script | Plain text document transformations |
| **JPG / PNG** | PNG, WEBP, PDF, GIF, DOCX, HEIC, AVIF | Native `sharp` / `pdfkit` | High-fidelity image layout compiler |
| **HEIC** | PDF, GIF, DOCX, AVIF, PNG, JPG, WEBP | Native `sharp` / `pdfkit` | Modern high-efficiency image parser |

---

## 🛠️ Environment Variables Configuration

To run CONVERTO in a full production-grade environment, add the following variables to your `.env.local` (for localhost) or your Vercel/hosting provider dashboard:

```env
# Gotenberg Rendering Engine API (e.g. hosted on Hugging Face, Railway, or local Docker)
GOTENBERG_URL=https://your-gotenberg-instance.hf.space
NEXT_PUBLIC_GOTENBERG_URL=https://your-gotenberg-instance.hf.space

# Cloudflare R2 / AWS S3 Storage (Optional - recommended for handling uploads >4.5MB)
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY=your_r2_access_key
R2_SECRET_KEY=your_r2_secret_key
R2_BUCKET=your_r2_bucket_name
```

---

## 🚀 Getting Started (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/sougandhhhhh/Converto.git
cd converto
npm install
```

### 2. Run Gotenberg locally (Optional)
If you wish to test full PDF rendering locally without Sandbox Mode, ensure Docker is running and spin up the Gotenberg container:
```bash
npm run gotenberg
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your browser.

---

## 📦 Tech Stack

* **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
* **Styling**: Tailwind CSS (Modern dynamic light & dark palettes)
* **Images**: [Sharp](https://github.com/lovell/sharp)
* **PDF Compiler**: [PDFKit](http://pdfkit.org/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **State & Fetching**: React Query & tRPC

---

## 📄 License
This project is licensed under the MIT License.
