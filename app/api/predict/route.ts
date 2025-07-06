import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Call your Replit Python API
    const response = await fetch("https://1555b7a4-f100-4efe-922d-df7850957d6-00-3a3tb3hld9pzw.sisko.replit.dev/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error || "Prediction failed" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to process prediction request" }, { status: 500 });
  }
}
