"use client";

export default function AuditSummary({ monthlySavings, annualSavings, summary, isHighSavings }: { monthlySavings: number; annualSavings: number; summary: string; isHighSavings: boolean }) {
  return (
    <>
      <div className="bg-[#1a1a1a] border border-neutral-700 text-neutral-200 p-3 rounded-lg">

        {/* savings section */}
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

        {/* summary section */}
        <h2>Summary</h2>
        <p>{summary}</p>

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
