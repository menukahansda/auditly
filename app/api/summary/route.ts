// LLM-generated summary
// this just defines the route

import { NextRequest, NextResponse } from "next/server";
import generateSummary from "@/lib/ai/summary";
import {UserInput, AuditFormData, ToolName, Plan} from "@/lib/audit/types";

export async function POST(request: NextRequest) {
  try {
    const { userInput, auditResult } = await request.json();

    const convertedInput: UserInput = {
      useCase: userInput.primaryUseCase,
      tools: userInput.tools.map((tool: AuditFormData["tools"][number]) => ({
        toolName: tool.toolName as ToolName,
        plan: tool.planType as Plan<ToolName>,
        monthlySpend: Number(tool.monthlySpend),
        teamSize: Number(tool.teamSize),
      })),
    };

    const result = await generateSummary(convertedInput, auditResult);
    return NextResponse.json({ summary: result }, { status: 200 });
  } catch (err) {
    console.error("Error generating summary: ", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Cannot generate summary" },
      { status: 500 },
    );
  }
}
