import { createClient } from "@supabase/supabase-js";
import { AuditResult, ToolInput } from "../audit/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function insertAuditWithTools(
  result: AuditResult,
  useCase: string,
  inputs: ToolInput[],
) {
  const { data, error: auditError } = await supabase
    .from("audits")
    .insert({
      primary_use_case: useCase,
      total_monthly_savings: result.totalMonthlySavings,
      total_annual_savings: result.totalAnnualSavings,
      summary: result.summary,
      is_high_savings: result.isHighSavings,
      cta: result.cta,
    })
    .select("id")
    .single();

  if (auditError) throw new Error(auditError.message);

  const rows = result.tools.map((tool) => {
    const input = inputs.find((i) => i.toolName === tool.toolName);
    return {
      audit_id: data.id,
      tool_name: tool.toolName,
      current_plan: input?.plan ?? null,
      current_spend: tool.currentSpend,
      team_size: input?.teamSize ?? null,
      recommended_plan: tool.recommendedPlan ?? null,
      recommended_alternative: tool.recommendedAlternative ?? null,
      monthly_savings: tool.monthlySavings,
      annual_savings: tool.annualSavings,
      reason: tool.reason,
    };
  });

  const { error: toolError } = await supabase
    .from("audit_tool_results")
    .insert(rows);

  if (toolError) {
    await supabase.from("audits").delete().eq("id", data.id);
    throw new Error(toolError.message);
  }

  return data.id;
}

export async function getAuditById(id: string) {
  const { data, error } = await supabase
    .from("audits")
    .select("*, audit_tool_results(*)")
    .eq("id", id)
    .single();

  if (error?.code === "PGRST116") return null;
  if (error) throw new Error(error.message);
  return data;
}

export async function createLead(email: string) {
  const { data, error } = await supabase
    .from("leads")
    .insert({ email })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      // unique_violation
      throw new Error("DUPLICATE_EMAIL");
    }
    throw new Error(error.message);
  }

  return data.id;
}
