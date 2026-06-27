"use client";

import type { ToolAuditResult } from "@/lib/audit/types";
export default function RecommendationBlock({
  tool,
}: {
  tool: ToolAuditResult;
}) {
  return (
    <>
      <div className="bg-[#1a1a1a] border border-neutral-700 text-neutral-200 p-3 rounded-lg">
        <h2 className="text-lg font-bold mb-2">Why we recommend this</h2>
        <p className="text-neutral-400 mb-4">{tool.reason}</p>

        <div className="flex flex-col gap-2">
          {tool.recommendedPlan && (
            <div className="flex flex-row justify-between border border-neutral-700 p-2 rounded-lg">
              <span>Switch to {tool.recommendedPlan} plan</span>
              <span className="text-green-600">
                Save ${tool.monthlySavings.toFixed(2)}/mo
              </span>
            </div>
          )}
          {tool.recommendedAlternative && (
            <div className="flex flex-row justify-between border border-neutral-700 p-2 rounded-lg">
              <span>Or switch to {tool.recommendedAlternative}</span>
              <span className="text-green-600">
                Save ${tool.monthlySavings.toFixed(2)}/mo
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
