import AuditCard from "@/components/audit/AuditCard";
import AuditSummary from "@/components/audit/AuditSummary";
import RecommendationBlock from "@/components/audit/RecommendationBlock";
import { AuditResult, ToolAuditResult } from "@/lib/audit/types";

export default function AuditPage() {
  const summary = "By switching to the recommended plans, you can save a total of $150 per month and $1800 annually.";
  const tool : ToolAuditResult = {
    toolName: "Cursor",
    currentSpend: 200,
    recommendedPlan: "Pro",
    recommendedAlternative: "Gemini",
    monthlySavings: 50,
    annualSavings: 600,
    reason: "The Pro plan offers more features at a lower cost compared to your current plan."
  };
  return (
    <>
      <div className="flex flex-col justify-center min-h-screen gap-4 overflow-auto max-w-5xl p-4 mx-auto">
        <AuditCard tool={tool} />

        <div className="grid grid-cols-2 gap-4">
          <AuditSummary monthlySavings={150.00} annualSavings={150 * 12} summary={summary} isHighSavings={true} />
          {/* <RecommendationBlock tools={result.tools} /> */}
        </div>
      </div>


    </>
  );
}

// define props to send data to each component