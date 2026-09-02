// LLM-generated summary
// this just defines the route

import { NextRequest, NextResponse } from "next/server";
import generateSummary from "@/lib/ai/summary";
import { updateAuditSummary } from "@/lib/db/supabase";
import {
  UserInput,
  AuditResult,
  AuditFormData,
  ToolInput,
  ToolName,
  Plan,
} from "@/lib/audit/types";

export async function POST(request: NextRequest) {
  let body: {
    userInput?: AuditFormData;
    auditResult?: unknown;
    auditId?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON" },
      { status: 400 },
    );
  }

  const { userInput, auditResult, auditId } = body;

  if (
    !userInput ||
    !Array.isArray(userInput.tools) ||
    typeof userInput.primaryUseCase !== "string" ||
    !auditResult ||
    typeof auditResult !== "object" ||
    !Array.isArray((auditResult as { tools?: unknown }).tools)
  ) {
    return NextResponse.json(
      {
        error:
          "userInput (with tools[] and primaryUseCase) and auditResult (with tools[]) are required",
      },
      { status: 400 },
    );
  }

  if (auditId !== undefined && typeof auditId !== "string") {
    return NextResponse.json(
      { error: "auditId must be a string when provided" },
      { status: 400 },
    );
  }

  try {
    const convertedInput: UserInput = {
      useCase: userInput.primaryUseCase as UserInput["useCase"],
      tools: userInput.tools.map((tool: AuditFormData["tools"][number]) => ({
        toolName: tool.toolName as ToolName,
        plan: tool.planType as Plan<ToolName>,
        monthlySpend: Number(tool.monthlySpend),
        teamSize: Number(tool.teamSize),
      })) as ToolInput[],
    };

    const summary = await generateSummary(
      convertedInput,
      auditResult as AuditResult,
    );

    // Persist the generated summary onto the existing audit record so the
    // public /audit/[id] page can show the same summary. Generation having
    // succeeded is independent of persistence succeeding — report both.
    let persisted = false;
    let persistError: string | undefined;

    if (auditId) {
      try {
        await updateAuditSummary(auditId, summary);
        persisted = true;
      } catch (err) {
        console.error("Error persisting audit summary:", err);
        persistError =
          err instanceof Error ? err.message : "Failed to save summary";
      }
    }

    return NextResponse.json(
      { summary, persisted, persistError },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error generating summary: ", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Cannot generate summary" },
      { status: 500 },
    );
  }
}
