import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const mockCreate = vi.hoisted(() => vi.fn());

// groq-sdk's default export is a class whose instances expose
// chat.completions.create(...). Mocking it lets every Groq failure mode be
// simulated without a real network call or a real API key.
vi.mock("groq-sdk", () => ({
  default: class MockGroq {
    chat = { completions: { create: mockCreate } };
  },
}));

const { default: generateSummary, buildFallbackSummary } = await import(
  "@/lib/ai/summary"
);
import type { AuditResult, UserInput } from "@/lib/audit/types";

const userInput: UserInput = { useCase: "mixed", tools: [] };

const auditResult: AuditResult = {
  tools: [
    {
      toolName: "ChatGPT",
      currentSpend: 60,
      recommendedPlan: "Plus",
      monthlySavings: 18,
      annualSavings: 216,
      reason: "test reason",
    },
  ],
  totalMonthlySavings: 18,
  totalAnnualSavings: 216,
  isHighSavings: false,
  cta: "",
  summary: "",
};

const originalApiKey = process.env.GROQ_API_KEY;

describe("generateSummary reliability", () => {
  beforeEach(() => {
    mockCreate.mockReset();
    process.env.GROQ_API_KEY = "test-key";
  });

  afterEach(() => {
    process.env.GROQ_API_KEY = originalApiKey;
  });

  it("returns the AI-generated content on success", async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: "AI generated summary." } }],
    });
    const result = await generateSummary(userInput, auditResult);
    expect(result).toBe("AI generated summary.");
  });

  it("falls back to the deterministic summary when GROQ_API_KEY is missing", async () => {
    delete process.env.GROQ_API_KEY;
    const result = await generateSummary(userInput, auditResult);
    expect(result).toContain("$60.00");
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("falls back when the Groq request throws (network failure / rate limit / non-success response)", async () => {
    mockCreate.mockRejectedValue(new Error("rate limited"));
    const result = await generateSummary(userInput, auditResult);
    expect(result).toContain("$18.00");
  });

  it("falls back when the choices array is empty", async () => {
    mockCreate.mockResolvedValue({ choices: [] });
    const result = await generateSummary(userInput, auditResult);
    expect(result).toContain("ChatGPT");
  });

  it("falls back when message content is missing", async () => {
    mockCreate.mockResolvedValue({ choices: [{ message: {} }] });
    const result = await generateSummary(userInput, auditResult);
    expect(result).toContain("ChatGPT");
  });

  it("falls back on a completely unexpected response shape", async () => {
    mockCreate.mockResolvedValue({});
    const result = await generateSummary(userInput, auditResult);
    expect(result).toContain("ChatGPT");
  });
});

describe("buildFallbackSummary (deterministic, data-driven)", () => {
  it("reflects the actual spend and savings without fabricating data", () => {
    const summary = buildFallbackSummary(auditResult);
    expect(summary).toContain("$60.00");
    expect(summary).toContain("$18.00");
    expect(summary).toContain("$216.00");
    expect(summary).toContain("ChatGPT");
    expect(summary).toContain("Plus");
  });

  it("communicates an already-optimized setup without inventing savings", () => {
    const optimized: AuditResult = {
      tools: [
        {
          toolName: "Cursor",
          currentSpend: 20,
          monthlySavings: 0,
          annualSavings: 0,
          reason:
            "Current setup appears appropriately matched to team size and usage.",
        },
      ],
      totalMonthlySavings: 0,
      totalAnnualSavings: 0,
      isHighSavings: false,
      cta: "",
      summary: "",
    };
    const summary = buildFallbackSummary(optimized);
    expect(summary).toContain("well-matched");
    expect(summary).not.toContain("potential savings");
  });

  it("handles an empty tools array without crashing", () => {
    const empty: AuditResult = {
      tools: [],
      totalMonthlySavings: 0,
      totalAnnualSavings: 0,
      isHighSavings: false,
      cta: "",
      summary: "",
    };
    expect(() => buildFallbackSummary(empty)).not.toThrow();
  });
});
