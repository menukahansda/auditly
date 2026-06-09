import AuditCard from '@/components/audit/AuditCard';
import AuditSummary from '@/components/audit/AuditSummary';
import RecommendationBlock from '@/components/audit/RecommendationBlock';

export default function AuditPage() {
    return (
        <>
        <div className="">
            <AuditCard />
        </div>
        <div className="clas">
            <AuditSummary />
            <RecommendationBlock />
        </div>
        </>
    );
}

// define props to send data to each component