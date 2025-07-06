import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received body for prediction:", body);

    const response = await fetch("https://1555b7a4-f100-4efe-922d-df7f850957d6-00-3a3tb3hld9pzw.sisko.replit.dev/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("Replit API response:", data);

    if (!response.ok) {
      console.error("Replit API error:", data);
      return NextResponse.json({ error: data.error || "Prediction failed" }, { status: 500 });
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
