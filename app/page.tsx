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
  const { submitAudit, loading, error, result } = useAudit();
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
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && !result && (
        <SpendForm handleSubmit={submitAudit} loading={loading} />
      )}
    </>
  );
}

// before result & loading => spendform
// after loading => loading spinner
// after result => audit result page or redirect to app/audit
