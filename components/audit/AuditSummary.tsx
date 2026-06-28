"use client";

export default function AuditSummary({ monthlySavings, annualSavings, summary, isHighSavings, isLoadingSummary }: { monthlySavings: number; annualSavings: number; summary: string; isHighSavings: boolean; isLoadingSummary : boolean; }) {
  return (
    <>
      <div className="bg-[#1a1a1a] border border-neutral-700 text-neutral-200 p-3 rounded-lg">

        {/* savings section */}
        {monthlySavings > 0 && (
        <>
        <h2>Potential Savings</h2>
        <div className="flex flex-row gap-4">
          <div className="flex flex-col">
            <h3>Monthly</h3>
            <p>${monthlySavings.toFixed(2)}</p>
          </div>
          <div className="flex flex-col">
            <h3>Yearly</h3>
            <p>${annualSavings.toFixed(2)}</p>
          </div>
        </div>
        </>
      )}
        {/* summary section */}
        <h2>Summary</h2>
        {isLoadingSummary ? (
          <div className="space-y-2 animate-pulse mt-2">
            <div className="h-4 bg-neutral-700 rounded w-full" />
            <div className="h-4 bg-neutral-700 rounded w-4/5" />
            <div className="h-4 bg-neutral-700 rounded w-3/5" />
          </div>
        ) : (
          <p>{summary}</p>
        )}

        {/* high savings alert */}
        {isHighSavings && (
          <div className="">
            <span className="font-bold bg-green-950 text-green-600 p-1 m-1">High Savings</span>
            <span>High Savings Opportunity! Consider switching to the recommended plan.</span>
          </div>
        )}

      </div>
    </>
  );
}
