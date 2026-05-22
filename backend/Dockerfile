FROM python:3.10-slim

# Prevent writing pyc files and enable buffering
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install runtime system deps:
# - poppler-utils/qpdf/mupdf-tools: PDF rendering and normalization
# - tesseract/ghostscript/ocrmypdf deps: OCR pipeline for scanned PDFs
# - libreoffice/fonts: office and visual fidelity pathways
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    poppler-utils \
    qpdf \
    mupdf-tools \
    ghostscript \
    tesseract-ocr \
    tesseract-ocr-eng \
    tesseract-ocr-osd \
    pngquant \
    unpaper \
    libreoffice \
    fonts-dejavu \
    fonts-liberation \
    fonts-noto-core \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
