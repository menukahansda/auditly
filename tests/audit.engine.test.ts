import { describe, expect, it } from "vitest";
import { generateAudit } from "../lib/audit/engine";

describe("AI Spend Audit Engine", () => {

	it("detects team plan downgrade opportunity", () => {
		const result = generateAudit({
			teamSize: 2,
			useCase: "mixed",
			tools: [
				{
					toolName: "ChatGPT",
					plan: "Business",
					seats: 2,
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
			teamSize: 1,
			useCase: "coding",
			tools: [
				{
					toolName: "GitHub Copilot",
					plan: "Enterprise",
					seats: 1,
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
			"Enterprise governance features"
		);
	});

	it("returns honest optimized response for efficient setup", () => {
		const result = generateAudit({
			teamSize: 1,
			useCase: "coding",
			tools: [
				{
					toolName: "Cursor",
					plan: "Pro",
					seats: 1,
					monthlySpend: 20,
				},
			],
		});

		const tool = result.tools[0];

		expect(tool.monthlySavings).toBe(0);
		expect(result.totalMonthlySavings).toBe(0);
		expect(result.totalAnnualSavings).toBe(0);
		expect(tool.reason).toContain(
			"Current setup appears appropriately matched"
		);
		expect(result.summary).toContain(
			"appears efficient overall"
		);
	});

	it("calculates total savings correctly across multiple tools", () => {
		const result = generateAudit({
			teamSize: 3,
			useCase: "mixed",
			tools: [
				{
					toolName: "ChatGPT",
					plan: "Enterprise",
					seats: 3,
					monthlySpend: 180,
				},
				{
					toolName: "Cursor",
					plan: "Ultra",
					seats: 1,
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

		expect(result.totalMonthlySavings).toBe(263);
		expect(result.totalAnnualSavings).toBe(3156);
	});

	it("flags very expensive configurations as high savings", () => {
		const result = generateAudit({
			teamSize: 8,
			useCase: "mixed",
			tools: [
				{
					toolName: "ChatGPT",
					plan: "Enterprise",
					seats: 5,
					monthlySpend: 1000,
				},
				{
					toolName: "Cursor",
					plan: "Ultra",
					seats: 5,
					monthlySpend: 1000,
				},
			],
		});

		expect(result.totalMonthlySavings).toBeGreaterThan(500);
		expect(result.isHighSavings).toBe(true);
		expect(result.summary).toContain(
			"High optimization potential detected"
		);
	});

	it("recommends Claude for research-heavy ChatGPT usage", () => {
		const result = generateAudit({
			teamSize: 2,
			useCase: "research",
			tools: [
				{
					toolName: "ChatGPT",
					plan: "Business",
					seats: 2,
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