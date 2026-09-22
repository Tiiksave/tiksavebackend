export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);
  const backend = (context.env.BACKEND_URL || "").replace(/\/+$/, "");

  if (!backend) {
    return new Response(JSON.stringify({ok:false,error:"BACKEND_URL is not configured"}), {
      status:503,
      headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}
    });
  }

  const target = backend + "/api" + url.pathname.replace(/^\/api/, "") + url.search;
  const headers = new Headers(request.headers);
  headers.delete("host");

  const init = {
    method: request.method,
    headers,
    redirect: "follow"
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
  }

  try {
    const response = await fetch(target, init);
    const out = new Response(response.body, response);
    out.headers.set("Access-Control-Allow-Origin", url.origin);
    out.headers.set("Access-Control-Allow-Credentials", "true");
    out.headers.set("X-Content-Type-Options", "nosniff");
    out.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    return out;
  } catch {
    return new Response(JSON.stringify({ok:false,error:"Backend unavailable"}), {
      status:502,
      headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}
    });
  }
}

export async function onRequestOptions(context) {
  const origin = new URL(context.request.url).origin;
  return new Response(null, {
    status:204,
    headers:{
      "Access-Control-Allow-Origin":origin,
      "Access-Control-Allow-Methods":"GET,POST,OPTIONS",
      "Access-Control-Allow-Headers":"Content-Type, Authorization",
      "Access-Control-Allow-Credentials":"true",
      "Access-Control-Max-Age":"86400"
    }
  });
}