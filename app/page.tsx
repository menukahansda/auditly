"use client";

import SpendForm from "@/components/forms/SpendForm";
import useAudit from "@/hooks/useAudit";
import { useRouter} from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const {submitAudit, loading, error, result} = useAudit();
  const router = useRouter();
  
  useEffect(() => {
    if (result) {
      router.push("/audit");
    }
  }, [result, router]);

  return (
    <>
      {!result && !loading && <SpendForm handleSubmit={submitAudit} loading={loading}/>}
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </>
      
  );
}

// before result & loading => spendform
// after loading => loading spinner
// after result => audit result page or redirect to app/audit