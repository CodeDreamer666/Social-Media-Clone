import "server-only";

import { env } from "~/env";

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function createPrivateImageResponse(imageUrl: string) {
  const imageOrigin = new URL(imageUrl).origin;
  const configuredGatewayOrigin = new URL(env.NEXT_PUBLIC_GATEWAY_URL).origin;

  if (imageOrigin !== configuredGatewayOrigin) {
    return Response.json({ error: "Image unavailable" }, { status: 404 });
  }

  let upstreamResponse: Response;

  try {
    upstreamResponse = await fetch(imageUrl, {
      cache: "no-store",
      redirect: "error",
    });
  } catch {
    return Response.json({ error: "Image unavailable" }, { status: 404 });
  }
  const contentType = upstreamResponse.headers
    .get("content-type")
    ?.split(";", 1)[0]
    ?.trim();

  if (
    !upstreamResponse.ok ||
    !upstreamResponse.body ||
    !contentType ||
    !ALLOWED_IMAGE_TYPES.has(contentType)
  ) {
    return Response.json({ error: "Image unavailable" }, { status: 404 });
  }

  const headers = new Headers({
    "Cache-Control": "private, no-store, max-age=0",
    "Content-Type": contentType,
    "X-Content-Type-Options": "nosniff",
  });
  const contentLength = upstreamResponse.headers.get("content-length");

  if (contentLength) {
    headers.set("Content-Length", contentLength);
  }

  return new Response(upstreamResponse.body, {
    status: 200,
    headers,
  });
}
