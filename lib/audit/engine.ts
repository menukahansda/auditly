import { PRICING } from "./pricing";

import type {
	AuditResult,
	Plan,
	AllToolAuditResults,
	ToolAuditResult,
	ToolInput,
	ToolName,
	UserInput,
} from "./types";

function getPlanPrice(
	toolName: ToolName,
	plan: Plan
): number | null {
	const toolPricing = PRICING[toolName];

	if (!toolPricing) return null;

	const price = toolPricing[plan];

	if (typeof price !== "number") return null;

	return price;
}

function calculatePlanCost(
	pricePerSeat: number,
	seats: number
): number {
	return pricePerSeat * seats;
}

// Plans billed by usage 
const METERED_PLANS = ["API direct", "API"] as const;

const METERED_PLAN_REASON =
	"This plan is billed by usage. Auditly doesn't collect token volume, model mix, or workload details, so it can't identify a savings opportunity here — review your API usage directly.";

function isMeteredPlan(plan: Plan): boolean {
	return (METERED_PLANS as readonly string[]).includes(plan);
}

function getDefaultAlternativePlan(
	toolName: ToolName
): Plan | undefined {
	switch (toolName) {
		case "Cursor":
			return "Pro";

		case "ChatGPT":
			return "Plus";

		case "Claude":
			return "Pro";

		case "Gemini":
			return "Pro";

		case "GitHub Copilot":
			return "Pro";

		default:
			return undefined;
	}
}

function evaluateTool(
	tool: ToolInput,
	useCase: UserInput["useCase"]
): ToolAuditResult {
	let recommendedPlan: Plan | undefined;
	let recommendedAlternative: ToolName | undefined;

	const reasons: string[] = [];

	const currentSpend = tool.monthlySpend;

	const metered = isMeteredPlan(tool.plan);

	// Plan downgrade suggestions

	// Usage-based plans can't be optimised 
	if (metered) {
		reasons.push(METERED_PLAN_REASON);
	}

	// ChatGPT Business -> Plus
	else if (
		tool.toolName === "ChatGPT" &&
		tool.plan === "Business" &&
		tool.teamSize <= 2
	) {
		recommendedPlan = "Plus";

		reasons.push(
			"Business collaboration features are likely unnecessary for a very small team."
		);
	}

	// ChatGPT Enterprise -> Business
	else if (
		tool.toolName === "ChatGPT" &&
		tool.plan === "Enterprise" &&
		tool.teamSize <= 5
	) {
		recommendedPlan = "Business";

		reasons.push(
			"Enterprise plans are typically excessive for smaller organizations."
		);
	}

	// Claude Team -> Pro
	else if (
		tool.toolName === "Claude" &&
		tool.plan === "Team" &&
		tool.teamSize === 1
	) {
		recommendedPlan = "Pro";

		reasons.push(
			"Claude Team is likely overkill for minimal collaboration needs."
		);
	}

	// Cursor Team -> Pro
	else if (
		tool.toolName === "Cursor" &&
		tool.plan === "Team" &&
		tool.teamSize === 1
	) {
		recommendedPlan = "Pro";

		reasons.push(
			"Cursor Team may not provide enough additional value for a solo developer."
		);
	}

	// Cursor Ultra -> Pro+
	else if (
		tool.toolName === "Cursor" &&
		tool.plan === "Ultra"
	) {
		recommendedPlan = "Pro+";

		reasons.push(
			"Ultra plans are often unnecessary unless usage is extremely heavy."
		);
	}

	// Copilot Enterprise -> Business
	else if (
		tool.toolName === "GitHub Copilot" &&
		tool.plan === "Enterprise" &&
		tool.teamSize <= 10
	) {
		recommendedPlan = "Business";

		reasons.push(
			"Enterprise governance features may be unnecessary for a smaller team."
		);
	}

	// Gemini Ultra -> Pro
	else if (
		tool.toolName === "Gemini" &&
		tool.plan === "Ultra"
	) {
		recommendedPlan = "Pro";

		reasons.push(
			"Ultra is Gemini's heaviest tier; Pro is the next tier down and is usually sufficient."
		);
	}

	// Windsurf Team -> Pro
	else if (
		tool.toolName === "Windsurf" &&
		tool.plan === "Team" &&
		tool.teamSize === 1
	) {
		recommendedPlan = "Pro";

		reasons.push(
			"Windsurf Team's collaboration features aren't usable by a single developer."
		);
	}

	// Windsurf Max -> Pro
	else if (
		tool.toolName === "Windsurf" &&
		tool.plan === "Max"
	) {
		recommendedPlan = "Pro";

		reasons.push(
			"Max is Windsurf's heaviest usage tier; Pro is the next tier down and is often sufficient."
		);
	}

	// Alternative recommendations based on use case

	// Coding-heavy teams
	if (
		!metered &&
		useCase === "coding" &&
		(tool.toolName === "ChatGPT" ||
			tool.toolName === "Claude")
	) {
		recommendedAlternative = "Cursor";

		reasons.push(
			"Dedicated coding tools may provide better engineering ROI."
		);
	}

	// Research-heavy teams
	if (
		!metered &&
		useCase === "research" &&
		tool.toolName === "ChatGPT"
	) {
		recommendedAlternative = "Claude";

		reasons.push(
			"Claude is often preferred for long-form research workflows."
		);
	}

	// Writing-heavy teams
	if (
		!metered &&
		useCase === "writing" &&
		(tool.toolName === "Cursor" ||
			tool.toolName === "Windsurf")
	) {
		recommendedAlternative = "ChatGPT";

		reasons.push(
			"A general-purpose writing assistant may reduce unnecessary coding-tool spend."
		);
	}

	// Mixed stack optimization
	if (
		useCase === "mixed" &&
		tool.teamSize <= 3 &&
		tool.toolName === "ChatGPT" &&
		tool.plan === "Enterprise"
	) {
		reasons.push(
			"Smaller mixed-use teams can often consolidate onto lower-tier plans."
		);
	}

	// Savings calculation

	let recommendedMonthlyCost = currentSpend;

	// Recommended plan pricing
	if (recommendedPlan) {
		const pricePerSeat = getPlanPrice(
			tool.toolName,
			recommendedPlan
		);

		if (pricePerSeat !== null) {
			recommendedMonthlyCost =
				calculatePlanCost(
					pricePerSeat,
					tool.teamSize
				);
		}
	}

	// Alternative tool pricing
	else if (recommendedAlternative) {
		const alternativePlan =
			getDefaultAlternativePlan(
				recommendedAlternative
			);

		if (alternativePlan) {
			const altPrice = getPlanPrice(
				recommendedAlternative,
				alternativePlan
			);

			if (altPrice !== null) {
				recommendedMonthlyCost =
					calculatePlanCost(
						altPrice,
						tool.teamSize
					);
			}
		}
	}

	const monthlySavings = Math.max(
		0,
		currentSpend - recommendedMonthlyCost
	);

	const annualSavings = monthlySavings * 12;

	// Optimised case - no savings 

	if (
		monthlySavings === 0 &&
		!recommendedAlternative &&
		!recommendedPlan &&
		reasons.length === 0
	) {
		reasons.push(
			"Current setup appears appropriately matched to team size and usage."
		);
	}

	const reason = reasons.join(" ");

	return {
		toolName: tool.toolName,
		currentSpend,
		recommendedPlan,
		recommendedAlternative,
		monthlySavings,
		annualSavings,
		reason,
	};
}

function calculateTotals(
	tools: ToolAuditResult[]
) {
	const totalMonthlySavings = tools.reduce(
		(sum, tool) =>
			sum + tool.monthlySavings,
		0
	);

	const totalAnnualSavings = tools.reduce(
		(sum, tool) =>
			sum + tool.annualSavings,
		0
	);

	return {
		totalMonthlySavings,
		totalAnnualSavings,
		isHighSavings:
			totalMonthlySavings > 500,
	};
}

function generateCTA(
	totalMonthlySavings: number
): string {
	if (totalMonthlySavings > 500) {
		return (
			"Credex can help continuously monitor and reduce unnecessary AI tooling spend across your organization."
		);
	}

	if (totalMonthlySavings < 100) {
		return (
			"Your stack already looks efficient. Sign up to get notified when new optimizations become available."
		);
	}

	return (
		"Reviewing plan utilization regularly can help maintain efficient AI tooling costs."
	);
}

export function generateAudit(
	userInput: UserInput
): AuditResult {
	const toolResults =
		userInput.tools.map((tool) =>
			evaluateTool(
				tool,
				userInput.useCase
			)
		); // tool audit result type for each tool

	const totals =
		calculateTotals(toolResults);

	const partialResult: Omit<AuditResult, 'summary' | 'cta'> = {
		tools: toolResults as AllToolAuditResults[],
		totalMonthlySavings:
			totals.totalMonthlySavings,
		totalAnnualSavings:
			totals.totalAnnualSavings,
		isHighSavings:
			totals.isHighSavings,
	}; // this is the result for a single tool
	const cta = generateCTA(totals.totalMonthlySavings);

	return {
		...partialResult,
		cta,
		summary: "",
	};
}
