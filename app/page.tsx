"use client";

import SpendForm from "@/components/forms/SpendForm";
import useAudit from "@/hooks/useAudit";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { submitAudit, loading, error, result } = useAudit();
  const router = useRouter();

  useEffect(() => {
    if (result) {
      router.push("/audit");
    }
  }, [result, router]);

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && !result && (
        <SpendForm handleSubmit={submitAudit} loading={loading} />
      )}
      <button onClick={() => router.push("/audit")}>Test audit page</button>
    </>
  );
}

// before result & loading => spendform
// after loading => loading spinner
// after result => audit result page or redirect to app/audit
