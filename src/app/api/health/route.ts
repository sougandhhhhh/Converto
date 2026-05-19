import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const GOTENBERG_URL = process.env.GOTENBERG_URL || "http://localhost:3020";
  
  // Detect if any AWS / R2 / custom S3 environment keys are configured
  const hasS3 = !!(
    process.env.AWS_ACCESS_KEY_ID ||
    process.env.AWS_SECRET_ACCESS_KEY ||
    process.env.CLOUDFLARE_R2_BUCKET ||
    process.env.AWS_S3_BUCKET
  );
  
  let gotenbergConnected = false;
  try {
    // Ping gotenberg health check endpoint
    const res = await fetch(`${GOTENBERG_URL}/health`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      gotenbergConnected = true;
    }
  } catch (e) {
    // Ignore error, server is offline
  }
  
  return NextResponse.json({
    gotenberg: gotenbergConnected ? "online" : "offline",
    storage: hasS3 ? "cloud" : "local",
    maxSize: "50 MB",
  });
}
