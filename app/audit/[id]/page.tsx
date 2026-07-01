import { notFound } from "next/navigation";
import Link from "next/link";
import { getAuditById } from "@/lib/db/supabase";
import AuditCard from "@/components/audit/AuditCard";
import AuditSummary from "@/components/audit/AuditSummary";
import type { ToolAuditResult, ToolName, Plan } from "@/lib/audit/types";

interface SharedAuditPageProps {
  params: Promise<{ id: string }>;
}

export default async function SharedAuditPage({ params }: SharedAuditPageProps) {
  const { id } = await params;

  const audit = await getAuditById(id);

  if (!audit) {
    notFound();
  }

  const tools: ToolAuditResult[] = (audit.audit_tool_results ?? []).map(
    (tool): ToolAuditResult => ({
      toolName: tool.tool_name as ToolName,
      currentSpend: tool.current_spend,
      recommendedPlan: tool.recommended_plan
        ? (tool.recommended_plan as Plan<ToolName>)
        : undefined,
      recommendedAlternative: tool.recommended_alternative
        ? (tool.recommended_alternative as ToolName)
        : undefined,
      monthlySavings: tool.monthly_savings,
      annualSavings: tool.annual_savings,
      reason: tool.reason,
    })
  );

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-neutral-200">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-semibold text-white">
            Your Audit Results
          </h1>
          {audit.primary_use_case ? (
            <p className="mt-2 text-sm text-neutral-400">
              Primary use case: {audit.primary_use_case}
            </p>
          ) : null}
        </header>

        <div className="grid grid-cols-2 gap-4">
          {tools.map((tool) => (
            <AuditCard key={tool.toolName} tool={tool} />
          ))}
        </div>

        <div className="mt-10">
          <AuditSummary
            monthlySavings={audit.total_monthly_savings}
            annualSavings={audit.total_annual_savings}
            summary={audit.summary}
            isHighSavings={audit.is_high_savings}
            isLoadingSummary={false}
          />
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
          >
            Run your own audit
          </Link>
        </div>
      </div>
    </div>
  );
}