export async function handler(event) {
  const GEMINI_API_KEY = process.env.GEMINI_KEY;
  if (!GEMINI_API_KEY) return { statusCode: 500, body: "Missing API key" };

  let prompt = "";
  try {
    const body = JSON.parse(event.body);
    prompt = body.prompt || "";
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Unknown error" }),
    };
  }
}
