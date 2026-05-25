// User input types
export type ToolName = "Cursor" | "GitHub Copilot" | "Claude" | "ChatGPT" | "Anthropic" | "OpenAI" | "Gemini" | "Windsurf";

export const TOOL_PLANS={
    "Cursor": ["Hobby", "Pro", "Pro+", "Ultra", "Team", "Enterprise"],
    "GitHub Copilot": ["Free", "Pro", "Pro+", "Business", "Enterprise"],
    "Claude": ["Free", "Pro", "Max", "Team", "Enterprise", "API direct"],
    "ChatGPT": ["Free", "Go", "Plus", "Pro", "Business-codex", "Business-chatgpt-n-codex", "Enterprise", "API direct"],
    "Anthropic": ["API direct"],
    "OpenAI": ["API direct"],
    "Gemini": ["Free", "Plus", "Pro", "Ultra", "API"],
    "Windsurf": ["Free", "Pro", "Max", "Teams"]
} as const;

export type Plan = (typeof TOOL_PLANS)[keyof typeof TOOL_PLANS][number];

export type ToolInput = {
    toolName: ToolName;
    plan: Plan;
    monthlySpend: number;
    seats: number;
}

export type UserInput = {
    tools: ToolInput[];
    teamSize: number;
    useCase: "coding" | "writing" | "data" | "research" | "mixed";
}

// Output types
export type ToolAuditResult = {
    toolName: ToolName;
    currentSpend: number;
    recommendedPlan?: Plan;
    recommendedAlternative?: ToolName;
    monthlySavings: number;
    annualSavings: number;
    reason: string;
}

export type AuditResult = {
    tools: ToolAuditResult[];
    totalMonthlySavings: number;
    totalAnnualSavings: number;

    summary: string;
    isHighSavings: boolean;
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