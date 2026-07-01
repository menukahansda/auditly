"use client";

import AuditCard from "@/components/audit/AuditCard";
import AuditSummary from "@/components/audit/AuditSummary";
import { AuditResult, ToolAuditResult, AuditFormData } from "@/lib/audit/types";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useState, useEffect, useRef } from "react";
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

  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  async function copySharedLink() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${shareUrl}`,
      );

      setCopied(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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
          <button
            onClick={copySharedLink}
            className="w-fit px-4 py-2 bg-green-500 text-white rounded ml-4"
          >
            {copied ? "Copied!" : "Copy share link"}
          </button>
        </div>
      </div>
    </>
  );
}
