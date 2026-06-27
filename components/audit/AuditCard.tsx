"use client";

import type { ToolAuditResult } from "@/lib/audit/types";

export default function AuditCard({ tool }: { tool: ToolAuditResult }) {
  return (
    <>
      <div className="bg-[#1a1a1a] border border-neutral-700 text-neutral-200 p-3 rounded-lg">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-bold">{tool.toolName}</h2>
          <div className="flex flex-row gap-2">
            <span className="text-green-400 bg-green-950 border border-green-800 px-2 py-0.5 rounded-lg text-sm">
              ${tool.monthlySavings.toFixed(2)}/mo
            </span>
            <span className="text-green-400 bg-green-950 border border-green-800 px-2 py-0.5 rounded-lg text-sm">
              ${tool.annualSavings.toFixed(2)}/yr
            </span>
          </div>
        </div>

        <p className="text-sm text-neutral-400">
          {tool.monthlySavings > 0 ? (
            <>
              Spend drops from{" "}
              <span className="line-through text-neutral-500">
                ${tool.currentSpend.toFixed(2)}/mo
              </span>{" "}
              to{" "}
              <span className="text-neutral-200">
                ${(tool.currentSpend - tool.monthlySavings).toFixed(2)}/mo
              </span>
            </>
          ) : (
            <>
              Current spend:{" "}
              <span className="text-neutral-200">
                ${tool.currentSpend.toFixed(2)}/mo
              </span>
            </>
          )}
        </p>

        <p className="text-sm text-neutral-400">{tool.reason}</p>

        <div className="flex flex-col gap-2">
          {tool.recommendedPlan && (
            <div className="flex flex-row justify-between border border-neutral-700 p-2 rounded-lg text-sm">
              <span>Switch to {tool.recommendedPlan} plan</span>
              <span className="text-green-400">
                Save ${tool.monthlySavings.toFixed(2)}/mo
              </span>
            </div>
          )}
          {tool.recommendedAlternative && (
            <div className="flex flex-row justify-between border border-neutral-700 p-2 rounded-lg text-sm">
              <span>Or switch to {tool.recommendedAlternative}</span>
              <span className="text-green-400">
                Save ${tool.monthlySavings.toFixed(2)}/mo
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
