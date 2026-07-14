import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit, rateLimitConfigs } from "@/lib/rate-limit";

/**
 * Determine which rate-limit config applies to a given API path.
 * Returns null for routes that should skip rate limiting.
 */
function getRouteConfig(pathname: string) {
  // Skip rate limiting for webhook endpoints
  if (pathname.startsWith("/api/webhooks")) {
    return null;
  }

  // Auth endpoints: stricter limits
  if (pathname.startsWith("/api/auth")) {
    return { config: rateLimitConfigs.auth, prefix: "auth" };
  }

  // Contact endpoint: strict limits
  if (pathname.startsWith("/api/contact")) {
    return { config: rateLimitConfigs.contact, prefix: "contact" };
  }

  // All other API routes: general limits
  return { config: rateLimitConfigs.api, prefix: "api" };
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Generate a unique request ID
  const requestId = crypto.randomUUID();

  // Only rate-limit /api/* routes
  if (pathname.startsWith("/api")) {
    const routeConfig = getRouteConfig(pathname);

    if (routeConfig) {
      // Use IP + route prefix as the identifier
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        request.headers.get("x-real-ip") ??
        "unknown";
      const identifier = `${routeConfig.prefix}:${ip}`;

      const result = rateLimit.check(identifier, routeConfig.config);

      if (!result.success) {
        return NextResponse.json(
          {
            error: "Too many requests",
            retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
          },
          {
            status: 429,
            headers: {
              "Retry-After": String(
                Math.ceil((result.reset - Date.now()) / 1000)
              ),
              "X-RateLimit-Limit": String(routeConfig.config.maxRequests),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": String(result.reset),
              "X-Request-Id": requestId,
            },
          }
        );
      }

      // Attach rate-limit info to successful responses
      const response = NextResponse.next();
      response.headers.set(
        "X-RateLimit-Limit",
        String(routeConfig.config.maxRequests)
      );
      response.headers.set(
        "X-RateLimit-Remaining",
        String(result.remaining)
      );
      response.headers.set("X-RateLimit-Reset", String(result.reset));
      response.headers.set("X-Request-Id", requestId);
      return response;
    }
  }

  // Non-API routes or webhook routes: just add request ID
  const response = NextResponse.next();
  response.headers.set("X-Request-Id", requestId);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt, and share/icon images
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|opengraph-image.png|twitter-image.png|icon.png|apple-icon.png).*)",
  ],
};
