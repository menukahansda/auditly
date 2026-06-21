"use client";

import type { ToolAuditResult } from "@/lib/audit/types";

export default function AuditCard({ tool }: { tool: ToolAuditResult }) {
  return (
    <>
      <div className="bg-[#1a1a1a] border border-neutral-700 text-neutral-200 p-3 rounded-lg">
        <div className="flex flex-row content-between">
          <h2 className="text-lg font-bold mb-2">{tool.toolName}</h2>
          <div className="flex flex-row gap-4">
            <span className="text-green-600 bg-green-950 border rounded-lg">${tool.monthlySavings.toFixed(2)}/mo</span>
            <span className="text-green-600 bg-green-950 border rounded-lg">${tool.annualSavings.toFixed(2)}/yr</span>
          </div>
        </div>
        <br />
        <p className="">
            With our recommendations,
            spendings become $ {<span className="line-through">{tool.currentSpend.toFixed(2)}/mo</span>} {tool.currentSpend - tool.monthlySavings}/mo
          </p>
          <p className="">
            Switch to {tool.recommendedPlan} plan or {tool.recommendedAlternative}
          </p>
      </div>
    </>
  );
}
