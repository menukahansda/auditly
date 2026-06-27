"use client";

import AuditCard from "@/components/audit/AuditCard";
import AuditSummary from "@/components/audit/AuditSummary";
import RecommendationBlock from "@/components/audit/RecommendationBlock";
import { AuditResult, ToolAuditResult } from "@/lib/audit/types";
import useLocalStorage from "@/hooks/useLocalStorage";

export default function AuditPage() {
  const [result] = useLocalStorage<AuditResult | null>("auditResult", null);

  if (!result) return <p>No audit found.</p>;

  return (
    <>
      <div className="flex flex-col justify-center min-h-screen gap-4 overflow-auto max-w-5xl p-4 mx-auto">
        {result.tools.map((tool: ToolAuditResult) => (
          <div key={tool.toolName} className="flex flex-col gap-2">
            <AuditCard tool={tool} />
            <RecommendationBlock tool={tool} />
          </div>
        ))}

        <div className="grid grid-cols-2 gap-4">
          <AuditSummary
            monthlySavings={result.totalMonthlySavings}
            annualSavings={result.totalAnnualSavings}
            summary={result.summary}
            isHighSavings={result.isHighSavings}
          />
        </div>
      </div>
    </>
  );
}

// define props to send data to each component
