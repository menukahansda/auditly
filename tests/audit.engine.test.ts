import { describe, expect, it } from "vitest";
import { generateAudit } from "../lib/audit/engine";

describe("AI Spend Audit Engine", () => {

	it("detects team plan downgrade opportunity", () => {
		const result = generateAudit({
			useCase: "mixed",
			tools: [
				{
					toolName: "ChatGPT",
					plan: "Business",
					teamSize: 2,
					monthlySpend: 60,
				},
			],
		});

		const tool = result.tools[0];

		expect(tool.recommendedPlan).toBe("Plus");
		expect(tool.monthlySavings).toBeGreaterThan(0);

		// Plus = 21 * 2 = 42
		// Savings = 60 - 42 = 18

		expect(result.totalMonthlySavings).toBe(18);
		expect(result.totalAnnualSavings).toBe(216);
	});

	it("detects enterprise overkill for solo setup", () => {
		const result = generateAudit({
			useCase: "coding",
			tools: [
				{
					toolName: "GitHub Copilot",
					plan: "Enterprise",
					teamSize: 1,
					monthlySpend: 39,
				},
			],
		});

		const tool = result.tools[0];

		expect(tool.recommendedPlan).toBe("Business");

		// Enterprise = 39
		// Business = 19
		// Savings = 20

		expect(tool.monthlySavings).toBe(20);
		expect(tool.annualSavings).toBe(240);
		expect(tool.reason).toContain(
    		"Enterprise governance features may be unnecessary for a smaller team."
		);
	});

	it("returns honest optimized response for efficient setup", () => {
		const result = generateAudit({
			useCase: "coding",
			tools: [
				{
					toolName: "Cursor",
					plan: "Pro",
					teamSize: 1,
					monthlySpend: 20,
				},
			],
		});

		const tool = result.tools[0];

		expect(tool.monthlySavings).toBe(0);
		expect(result.totalMonthlySavings).toBe(0);
		expect(result.totalAnnualSavings).toBe(0);
		expect(tool.reason).toContain(
    		"Current setup appears appropriately matched to team size and usage."
		);
		expect(result.summary).toBe("");
	});

	it("calculates total savings correctly across multiple tools", () => {
		const result = generateAudit({
			useCase: "mixed",
			tools: [
				{
					toolName: "ChatGPT",
					plan: "Enterprise",
					teamSize: 3,
					monthlySpend: 180,
				},
				{
					toolName: "Cursor",
					plan: "Ultra",
					teamSize: 1,
					monthlySpend: 200,
				},
			],
		});

		// ChatGPT Enterprise -> Business
		// Business = 19 * 3 = 57
		// Savings = 180 - 57 = 123

		// Cursor Ultra -> Pro+
		// Pro+ = 60
		// Savings = 200 - 60 = 140

		const expectedTotalMonthly =
		result.tools[0].monthlySavings + result.tools[1].monthlySavings;

		expect(result.totalMonthlySavings).toBe(expectedTotalMonthly);
		expect(result.totalAnnualSavings).toBe(expectedTotalMonthly * 12);
	});

	it("flags very expensive configurations as high savings", () => {
		const result = generateAudit({
			useCase: "mixed",
			tools: [
				{
					toolName: "ChatGPT",
					plan: "Enterprise",
					teamSize: 5,
					monthlySpend: 1000,
				},
				{
					toolName: "Cursor",
					plan: "Ultra",
					teamSize: 5,
					monthlySpend: 1000,
				},
			],
		});

		expect(result.totalMonthlySavings).toBeGreaterThan(500);
		expect(result.isHighSavings).toBe(true);
		expect(result.cta).toContain("Credex can help continuously monitor");
	});

	it("recommends Claude for research-heavy ChatGPT usage", () => {
		const result = generateAudit({
			useCase: "research",
			tools: [
				{
					toolName: "ChatGPT",
					plan: "Business",
					teamSize: 2,
					monthlySpend: 60,
				},
			],
		});

		const tool = result.tools[0];

		expect(tool.recommendedAlternative).toBe(
			"Claude"
		);
		expect(tool.reason).toContain(
			"Claude is often preferred for long-form research workflows"
		);
	});

});

describe("Metered / usage-based plans", () => {

	const METERED_NOTICE = "billed by usage";

	it("reports Anthropic API direct as unoptimisable without inventing savings", () => {
		const result = generateAudit({
			useCase: "coding",
			tools: [
				{
					toolName: "Anthropic",
					plan: "API direct",
					teamSize: 5,
					monthlySpend: 800,
				},
			],
		});

		const tool = result.tools[0];

		expect(tool.recommendedPlan).toBeUndefined();
		expect(tool.recommendedAlternative).toBeUndefined();
		expect(tool.monthlySavings).toBe(0);
		expect(tool.annualSavings).toBe(0);
		expect(tool.reason).toContain(METERED_NOTICE);
		// Must not claim the setup is fine — Auditly has no basis for that.
		expect(tool.reason).not.toContain(
			"Current setup appears appropriately matched"
		);
	});

	it("reports OpenAI API direct as unoptimisable without inventing savings", () => {
		const result = generateAudit({
			useCase: "data",
			tools: [
				{
					toolName: "OpenAI",
					plan: "API direct",
					teamSize: 3,
					monthlySpend: 450,
				},
			],
		});

		const tool = result.tools[0];

		expect(tool.recommendedPlan).toBeUndefined();
		expect(tool.recommendedAlternative).toBeUndefined();
		expect(tool.monthlySavings).toBe(0);
		expect(tool.reason).toContain(METERED_NOTICE);
		expect(tool.reason).not.toContain(
			"Current setup appears appropriately matched"
		);
	});

	it("reports Gemini API as unoptimisable without inventing savings", () => {
		const result = generateAudit({
			useCase: "mixed",
			tools: [
				{
					toolName: "Gemini",
					plan: "API",
					teamSize: 2,
					monthlySpend: 120,
				},
			],
		});

		const tool = result.tools[0];

		expect(tool.recommendedPlan).toBeUndefined();
		expect(tool.recommendedAlternative).toBeUndefined();
		expect(tool.monthlySavings).toBe(0);
		expect(tool.reason).toContain(METERED_NOTICE);
	});

	it("suppresses use-case alternatives for a metered plan on an otherwise-covered tool", () => {
		//an API workload is not substitutable by a seat-based editor subscription.
		const result = generateAudit({
			useCase: "coding",
			tools: [
				{
					toolName: "Claude",
					plan: "API direct",
					teamSize: 4,
					monthlySpend: 300,
				},
			],
		});

		const tool = result.tools[0];

		expect(tool.recommendedAlternative).toBeUndefined();
		expect(tool.monthlySavings).toBe(0);
		expect(tool.reason).toContain(METERED_NOTICE);
	});

	it("leaves non-metered optimisation rules untouched", () => {
		// Same tool, non-metered plan: the existing coding rule still fires.
		const result = generateAudit({
			useCase: "coding",
			tools: [
				{
					toolName: "Claude",
					plan: "Max",
					teamSize: 2,
					monthlySpend: 200,
				},
			],
		});

		const tool = result.tools[0];

		expect(tool.recommendedAlternative).toBe("Cursor");
		expect(tool.reason).toContain(
			"Dedicated coding tools may provide better engineering ROI."
		);
		expect(tool.reason).not.toContain(METERED_NOTICE);
	});

});

describe("Gemini optimisation rules", () => {

	it("recommends stepping down from Ultra to Pro", () => {
		const result = generateAudit({
			useCase: "mixed",
			tools: [
				{
					toolName: "Gemini",
					plan: "Ultra",
					teamSize: 2,
					monthlySpend: 136,
				},
			],
		});

		const tool = result.tools[0];

		// Pro = 20 * 2 = 40
		// Savings = 136 - 40 = 96

		expect(tool.recommendedPlan).toBe("Pro");
		expect(tool.monthlySavings).toBe(96);
		expect(tool.annualSavings).toBe(1152);
	});

	it("does not downgrade the baseline Pro tier", () => {
		const result = generateAudit({
			useCase: "mixed",
			tools: [
				{
					toolName: "Gemini",
					plan: "Pro",
					teamSize: 2,
					monthlySpend: 40,
				},
			],
		});

		const tool = result.tools[0];

		expect(tool.recommendedPlan).toBeUndefined();
		expect(tool.recommendedAlternative).toBeUndefined();
		expect(tool.monthlySavings).toBe(0);
		expect(tool.reason).toContain(
			"Current setup appears appropriately matched"
		);
	});

	it("never produces negative savings when spend is below the recommended cost", () => {
		const result = generateAudit({
			useCase: "mixed",
			tools: [
				{
					toolName: "Gemini",
					plan: "Ultra",
					teamSize: 5,
					monthlySpend: 0,
				},
			],
		});

		const tool = result.tools[0];

		// Recommended cost (20 * 5 = 100) exceeds spend (0)
		expect(tool.recommendedPlan).toBe("Pro");
		expect(tool.monthlySavings).toBe(0);
		expect(tool.annualSavings).toBe(0);
	});

});

describe("Windsurf optimisation rules", () => {

	it("recommends Pro for a solo developer on the Team plan", () => {
		const result = generateAudit({
			useCase: "coding",
			tools: [
				{
					toolName: "Windsurf",
					plan: "Team",
					teamSize: 1,
					monthlySpend: 40,
				},
			],
		});

		const tool = result.tools[0];

		// Pro = 20 * 1 = 20
		// Savings = 40 - 20 = 20

		expect(tool.recommendedPlan).toBe("Pro");
		expect(tool.monthlySavings).toBe(20);
		expect(tool.reason).toContain(
			"aren't usable by a single developer"
		);
	});

	it("leaves the Team plan alone for an actual team", () => {
		const result = generateAudit({
			useCase: "coding",
			tools: [
				{
					toolName: "Windsurf",
					plan: "Team",
					teamSize: 3,
					monthlySpend: 120,
				},
			],
		});

		const tool = result.tools[0];

		expect(tool.recommendedPlan).toBeUndefined();
		expect(tool.monthlySavings).toBe(0);
	});

	it("recommends stepping down from Max to Pro", () => {
		const result = generateAudit({
			useCase: "coding",
			tools: [
				{
					toolName: "Windsurf",
					plan: "Max",
					teamSize: 1,
					monthlySpend: 200,
				},
			],
		});

		const tool = result.tools[0];

		// Pro = 20 * 1 = 20
		// Savings = 200 - 20 = 180

		expect(tool.recommendedPlan).toBe("Pro");
		expect(tool.monthlySavings).toBe(180);
		expect(tool.annualSavings).toBe(2160);
	});

	it("does not downgrade the baseline Pro tier", () => {
		const result = generateAudit({
			useCase: "coding",
			tools: [
				{
					toolName: "Windsurf",
					plan: "Pro",
					teamSize: 2,
					monthlySpend: 40,
				},
			],
		});

		const tool = result.tools[0];

		expect(tool.recommendedPlan).toBeUndefined();
		expect(tool.monthlySavings).toBe(0);
	});

	it("suggests a general-purpose assistant for writing-heavy teams", () => {
		const result = generateAudit({
			useCase: "writing",
			tools: [
				{
					toolName: "Windsurf",
					plan: "Team",
					teamSize: 3,
					monthlySpend: 120,
				},
			],
		});

		const tool = result.tools[0];

		// ChatGPT Plus = 21 * 3 = 63
		// Savings = 120 - 63 = 57

		expect(tool.recommendedAlternative).toBe("ChatGPT");
		expect(tool.monthlySavings).toBe(57);
	});

});