// validate -> convert types -> run engine -> return result
import { NextResponse, NextRequest } from "next/server";
import { validateTool, validateUseCase} from "@/utils/validateInput";
import { generateAudit } from "@/lib/audit/engine";
import { UserInput, ToolFormData, ToolName, Plan} from "@/lib/audit/types";
import { insertAuditWithTools } from "@/lib/db/supabase";

export async function POST(request: NextRequest) {
  let userInput: { primaryUseCase?: unknown; tools?: unknown };
  try {
    userInput = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON" },
      { status: 400 },
    );
  }

  if (!userInput || typeof userInput !== "object") {
    return NextResponse.json(
      { error: "Request body must be a JSON object" },
      { status: 400 },
    );
  }

  if (!Array.isArray(userInput.tools)) {
    return NextResponse.json(
      { error: "tools must be an array" },
      { status: 400 },
    );
  }

  const useCaseValidation = validateUseCase(userInput.primaryUseCase as string);
  if (!useCaseValidation.valid) {
    return NextResponse.json({ error: useCaseValidation.errors }, { status: 400 });
  }

  for (const tool of userInput.tools) {
    if (!tool || typeof tool !== "object") {
      return NextResponse.json({ error: "Invalid tool entry" }, { status: 400 });
    }

    const toolValidation = validateTool(tool as ToolFormData);

    if (!toolValidation.valid) {
      return NextResponse.json({ error: toolValidation.errors }, { status: 400 });
    }
  }

  try {
    const data: UserInput = {
        useCase: userInput.primaryUseCase as UserInput["useCase"],
        tools: (userInput.tools as ToolFormData[]).map((tool) => ({
            toolName: tool.toolName as ToolName,
            plan: tool.planType as Plan<ToolName>,
            monthlySpend: Number(tool.monthlySpend),
            teamSize: Number(tool.teamSize)
        })) as UserInput["tools"]
    };
    const result = await generateAudit(data);
    const auditId = await insertAuditWithTools(result, data.useCase, data.tools);
    return NextResponse.json({ ...result, auditId }, { status: 200 });
  } catch (err) {
    console.error("Error processing audit request:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
