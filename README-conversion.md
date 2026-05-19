# Conversion Engine

This project uses Gotenberg for document conversion to avoid expensive APIs.

## Local Development

Run Gotenberg locally using Docker:
```bash
npm run gotenberg
```
Ensure your `.env.local` contains `GOTENBERG_URL=http://localhost:3000`.

## Production

For production on Vercel, deploy Gotenberg to Koyeb using the included `Dockerfile` and `koyeb.yaml`.
Then, in the Vercel dashboard, set the `GOTENBERG_URL` environment variable to your public Koyeb URL.
