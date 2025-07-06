import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received body for prediction:", body);

    const response = await fetch("https://1555b7a4-f100-4efe-922d-df7f850957d6-00-3a3tb3hld9pzw.sisko.replit.dev/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0"
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    console.log("Replit API raw response:", text);
    console.log("Replit API status:", response.status);

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return NextResponse.json({ error: "Replit API did not return JSON", raw: text, status: response.status }, { status: 500 });
    }

    if (!response.ok) {
      console.error("Replit API error:", data);
      return NextResponse.json({ error: data.error || "Prediction failed", raw: text, status: response.status }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json({ error: "Failed to process prediction request" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
