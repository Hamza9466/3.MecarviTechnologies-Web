import { NextRequest, NextResponse } from "next/server";

const LARAVEL_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Proxies storage image requests to the Laravel backend.
 * Use ?path=/storage/home-page/xxx.jpg
 * This avoids cross-origin issues and ensures images load when Laravel serves them.
 */
export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");
  if (!path || !path.startsWith("/storage/")) {
    return NextResponse.json({ error: "Missing or invalid path" }, { status: 400 });
  }

  const url = `${LARAVEL_BASE}${path}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return new NextResponse(null, { status: res.status });
    }
    const contentType = res.headers.get("content-type") || "application/octet-stream";
    const body = await res.arrayBuffer();
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("[api/storage] Proxy error:", err);
    return new NextResponse(null, { status: 502 });
  }
}
