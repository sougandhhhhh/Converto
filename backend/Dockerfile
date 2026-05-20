FROM python:3.10-slim

# Prevent writing pyc files and enable buffering
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install runtime system deps:
# - curl: health checks
# - poppler-utils: provides pdftoppm used for PDF -> image conversions
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    poppler-utils \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
