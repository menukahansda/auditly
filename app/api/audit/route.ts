// validate -> convert types -> run engine -> return result
import { NextResponse, NextRequest } from "next/server";
import { validateTool, validateUseCase} from "@/utils/validateInput";
import { generateAudit } from "@/lib/audit/engine";
import { UserInput, ToolFormData, ToolName, Plan} from "@/lib/audit/types";
import { insertAuditWithTools } from "@/lib/db/supabase";

export async function POST(request: NextRequest) {
  try {
    const userInput = await request.json();
    const validated: { valid: boolean; errors: string } = validateUseCase(
      userInput.primaryUseCase,
    );

    if (!validated.valid) {
      return NextResponse.json({ error: validated.errors }, { status: 400 });
    }
    for (const tool of userInput.tools) {
      const validated: { valid: boolean; errors: string } = validateTool(tool);

      if (!validated.valid) {
        return NextResponse.json({ error: validated.errors }, { status: 400 });
      }
    }

    const data: UserInput = {
        useCase: userInput.primaryUseCase,
        tools: userInput.tools.map((tool : ToolFormData) => ({
            toolName: tool.toolName as ToolName,
            plan: tool.planType as Plan<ToolName>,
            monthlySpend: Number(tool.monthlySpend),
            teamSize: Number(tool.teamSize)
        }))
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
