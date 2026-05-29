import { TOOL_PLANS, PRIMARY_USE_CASES } from "./constants";

export type ToolName = keyof typeof TOOL_PLANS;
export type Plan <T extends ToolName = ToolName> = typeof TOOL_PLANS[T][number];
export type UseCase = typeof PRIMARY_USE_CASES[number];
export type ToolInput = 
    {
        [K in ToolName]: {
        toolName: K;
        plan: Plan<K>;
        monthlySpend: number;
        seats: number;
    }
}[ToolName];

export type UserInput = {
    tools: ToolInput[];
    useCase: UseCase;
}

// Output types
export type ToolAuditResult<T extends ToolName = ToolName> = {
    toolName: T;
    currentSpend: number;
    recommendedPlan?: Plan<T>;
    recommendedAlternative?: ToolName;
    monthlySavings: number;
    annualSavings: number;
    reason: string;
}

export type AllToolAuditResults =
  { 
    [K in ToolName]: ToolAuditResult<K> 
}[ToolName];
  
export type AuditResult = {
    tools: AllToolAuditResults[];
    totalMonthlySavings: number;
    totalAnnualSavings: number;

    summary: string;
    isHighSavings: boolean;
    cta: string;
}
//     3. Audit results page
//  Per-tool breakdown: current spend → recommended action → savings + 1-
// sentence reason
//  Hero: total monthly savings + total annual savings, big and clear
//  For audits showing >$500/mo savings: surface Credex prominently as the way to
// capture more of that savings
//  For audits showing <$100/mo or already-optimal: be honest. “You’re spending
// well.” Don’t manufacture savings. Still capture the lead with a “notify me when
// new optimizations apply to your stack” signup
// Visual quality matters. This is the page that gets screenshotted and shared.