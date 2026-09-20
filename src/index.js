/**
 * Joseph's Home — Worker entry point.
 *
 * Everything except /api/* is served straight from public/ by Cloudflare's
 * edge. Only the chat endpoint runs code.
 */
import { handleChat } from "./chat.js";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat") {
      const origin = request.headers.get("Origin");
      if (origin && origin !== url.origin) {
        return json({ error: "Origin not allowed" }, 403);
      }
      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: CORS });
      }
      if (request.method !== "POST") {
        return json({ error: "Method not allowed" }, 405);
      }
      try {
        return await handleChat(request, env, ctx);
      } catch (err) {
        // Never leak a stack trace to a visitor. Fail to the phone number.
        console.error("chat error:", err && err.message);
        return json(
          {
            reply:
              "Something went wrong on our end. Please call us at 228-669-4346 " +
              "and a real person will help you.",
            source: "error",
          },
          200
        );
      }
    }

    if (url.pathname.startsWith("/api/")) {
      return json({ error: "Not found" }, 404);
    }

    // The repository root is the static asset directory. Never expose Worker
    // source or deployment metadata as downloadable site files.
    if (
      url.pathname.startsWith("/src/") ||
      url.pathname.startsWith("/.git") ||
      url.pathname.startsWith("/.github/") ||
      ["/package.json", "/package-lock.json", "/wrangler.jsonc", "/CHAT-BACKEND.md"].includes(url.pathname)
    ) {
      return json({ error: "Not found" }, 404);
    }

    return env.ASSETS.fetch(request);
  },
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}
