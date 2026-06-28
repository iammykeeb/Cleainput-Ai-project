export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid JSON" }), { status: 400 });
  }

  const hfResponse = await fetch(`${env.HF_SPACE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-shared-secret": env.SHARED_SECRET,
    },
    body: JSON.stringify(body),
  });

  const data = await hfResponse.text();
  return new Response(data, {
    status: hfResponse.status,
    headers: { "Content-Type": "application/json" },
  });
}
