// LLM-generated summary
// this just defines the route

import { NextRequest, NextResponse } from "next/server";
import generateSummary from "@/lib/ai/summary";

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    const result = await generateSummary(userData);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("Error generating summary: ", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Cannot generate summary" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const result = await generateSummary({} as any);
  return NextResponse.json({ result });
}