"use client";

import SpendForm, {
  SPEND_FORM_DRAFT_KEY,
  SPEND_FORM_TOOL_DRAFT_KEY,
  emptySpendFormData,
  emptyToolFormData,
} from "@/components/forms/SpendForm";
import useAudit from "@/hooks/useAudit";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { AuditFormData, ToolFormData } from "@/lib/audit/types";

export default function Home() {
  const { submitAudit, loading, error, result, resetError } = useAudit();
  const router = useRouter();
  const [, setSpendFormDraft] = useLocalStorage<AuditFormData>(
    SPEND_FORM_DRAFT_KEY,
    emptySpendFormData,
  );
  const [, setSpendToolDraft] = useLocalStorage<ToolFormData>(
    SPEND_FORM_TOOL_DRAFT_KEY,
    emptyToolFormData,
  );

  useEffect(() => {
    if (result) {
      // Submission succeeded => clear form
      setSpendFormDraft(emptySpendFormData);
      setSpendToolDraft(emptyToolFormData);
      router.push("/audit");
    }
  }, [result, router, setSpendFormDraft, setSpendToolDraft]);

  return (
    <>
      {loading && (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0a0a0a] text-neutral-200">
          <div className="h-8 w-8 rounded-full border-2 border-neutral-700 border-t-neutral-200 animate-spin" />
          <p className="text-sm text-neutral-400">Running your audit...</p>
        </div>
      )}
      {!loading && error && (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0a0a0a] text-neutral-200 px-4">
          <div className="w-full max-w-md bg-[#1a1a1a] border border-red-900 rounded-2xl p-6 text-center">
            <h1 className="text-lg font-semibold text-neutral-100 mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-neutral-400 mb-4">{error}</p>
            <button
              onClick={resetError}
              className="bg-neutral-100 text-black font-semibold px-4 py-2 rounded-lg hover:opacity-90"
            >
              Try again
            </button>
          </div>
        </div>
      )}
      {!loading && !error && !result && (
        <SpendForm handleSubmit={submitAudit} loading={loading} />
      )}
    </>
  );
}

// before result & loading => spendform
// after loading => loading spinner
// after result => audit result page or redirect to app/audit
