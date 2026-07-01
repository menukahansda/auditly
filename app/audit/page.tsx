"use client";

import AuditCard from "@/components/audit/AuditCard";
import AuditSummary from "@/components/audit/AuditSummary";
import { AuditResult, ToolAuditResult, AuditFormData } from "@/lib/audit/types";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AuditPage() {
  const [result] = useLocalStorage<AuditResult | null>("auditResult", null);
  const [formData] = useLocalStorage<AuditFormData | null>(
    "auditFormData",
    null,
  );
  const [summary, setSummary] = useState<string>("Generating summary...");
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);

  const [auditId] = useLocalStorage<string | null>("auditId", null);
  const shareUrl = `/audit/${auditId}`;

  useEffect(() => {
    if (!result || !formData) return;

    async function fetchSummary() {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: formData, auditResult: result }),
      });
      const data = await res.json();
      setSummary(data);
      setIsLoadingSummary(false);
    }

    fetchSummary();
  }, [result, formData]);
  if (!result) return <p>No audit found.</p>;

  return (
    <>
      <div className="flex flex-col justify-center min-h-screen gap-4 overflow-auto max-w-5xl p-4 mx-auto">
        <div className="grid grid-cols-2 gap-4">
          {result.tools.map((tool: ToolAuditResult) => (
            <AuditCard key={tool.toolName} tool={tool} />
          ))}
        </div>

        <AuditSummary
          monthlySavings={result.totalMonthlySavings}
          annualSavings={result.totalAnnualSavings}
          summary={summary}
          isHighSavings={result.isHighSavings}
          isLoadingSummary={isLoadingSummary}
        />
        <div className="flex justify-center">
          <Link
            href={shareUrl}
            target="_blank"
            className="w-fit px-4 py-2 bg-blue-500 text-white rounded"
          >
            Go to the shareable URL page
          </Link>
        </div>
      </div>
    </>
  );
}

