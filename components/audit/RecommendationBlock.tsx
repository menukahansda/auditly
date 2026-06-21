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

      </div>
    </>
  );
}
