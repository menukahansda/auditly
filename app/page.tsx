"use client";

import SpendForm from "@/components/forms/SpendForm";
import useAudit from "@/hooks/useAudit";
import type { AuditFormData } from '@/components/forms/SpendForm';

export default function Home() {
  const {submitAudit, loading, error, result} = useAudit();

  return (
    <>
      {!result && !loading && <SpendForm handleSubmit={submitAudit} loading={loading}/>}
      {loading && <p>Loading...</p>}
    </>
      
  );
}

// before result & loading => spendform
// after loading => loading spinner
// after result => audit result page or redirect to app/audit