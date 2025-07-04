import { type NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import path from "path"

// This route is deprecated. Prediction is now handled by a Python serverless function (predict.py) at the project root or /api directory for Vercel compatibility.
// See Vercel docs: https://vercel.com/docs/functions/python

export const dynamic = 'error'; // Disable this route

export async function POST(request: NextRequest) {
  try {
    const { summary, amountLost, scamType, state } = await request.json()

    // Create a Python script call to use the trained model
    const pythonScript = path.join(process.cwd(), "python", "predict_scam.py")

    return new Promise((resolve) => {
      const python = spawn("python", [pythonScript, summary, amountLost.toString(), scamType, state])

      let result = ""
      let error = ""

      python.stdout.on("data", (data) => {
        result += data.toString()
      })

      python.stderr.on("data", (data) => {
        error += data.toString()
      })

      python.on("close", (code) => {
        if (code === 0) {
          try {
            const prediction = JSON.parse(result)
            resolve(NextResponse.json(prediction))
          } catch (e) {
            resolve(NextResponse.json({ error: "Failed to parse prediction result" }, { status: 500 }))
          }
        } else {
          resolve(NextResponse.json({ error: error || "Python script failed" }, { status: 500 }))
        }
      })
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process prediction request" }, { status: 500 })
  }
}
