// create a middle hook for all the fetching
import { useState} from 'react';
import type { AuditFormData} from "@/lib/audit/types";
import {AuditResult} from "@/lib/audit/types";

export default function useAudit(){
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<AuditResult | null>(null);

    async function submitAudit(formData : AuditFormData){
        setLoading(true);
        setError(null);
        try{
            const res = await fetch('/api/audit',{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || res.statusText);
            
            setResult(data);
        }catch(err){
            setError(err instanceof Error ? err.message : "Something went wrong");
        }finally{
            setLoading(false);
        }
    }
    return {submitAudit, loading, error, result};
}
           