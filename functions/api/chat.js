export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const hfSpaceUrl = (env.HF_SPACE_URL || "").trim();

    if (!hfSpaceUrl) {
      return new Response(JSON.stringify({ error: "HF_SPACE_URL is not set in Cloudflare" }), { status: 500 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "invalid JSON" }), { status: 400 });
    }

    const hfResponse = await fetch(`${hfSpaceUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-shared-secret": (env.SHARED_SECRET || "").trim(),
      },
      body: JSON.stringify(body),
    });

    const data = await hfResponse.text();
    return new Response(data, {
      status: hfResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Function exception: " + err.message }), { status: 500 });
  }
}
