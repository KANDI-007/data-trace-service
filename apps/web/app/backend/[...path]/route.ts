import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const HOP = new Set(["host", "connection", "content-length", "transfer-encoding"]);

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }): Promise<NextResponse> {
  const { path } = await context.params;
  const base = process.env.API_URL?.trim();
  if (!base) return NextResponse.json({ error: "API non configurée" }, { status: 503 });
  const target = `${base.replace(/\/$/, "")}/${path.join("/")}${request.nextUrl.search}`;
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!HOP.has(key.toLowerCase())) headers.set(key, value);
  });
  const init: RequestInit = { method: request.method, headers, redirect: "manual" };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }
  try {
    const response = await fetch(target, { ...init, signal: AbortSignal.timeout(8000) });
    const outHeaders = new Headers();
    const type = response.headers.get("content-type");
    const disposition = response.headers.get("content-disposition");
    if (type) outHeaders.set("content-type", type);
    if (disposition) outHeaders.set("content-disposition", disposition);
    for (const cookie of response.headers.getSetCookie()) outHeaders.append("set-cookie", cookie);
    return new NextResponse(response.body, { status: response.status, headers: outHeaders });
  } catch {
    return NextResponse.json({ error: "API indisponible" }, { status: 503 });
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
