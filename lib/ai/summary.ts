import Groq from "groq-sdk";
import { UserInput, AuditResult } from "@/lib/audit/types";

// A deterministic, data-driven summary built only from the AuditResult the
// engine already produced. Used whenever Groq is unavailable, unconfigured,
// or returns something unusable — the deterministic audit is authoritative,
// so the product must remain useful without the AI enrichment. This must
// never fabricate a tool, plan, or savings figure that isn't already in
// auditResult.
export function buildFallbackSummary(auditResult: AuditResult): string {
  const { tools, totalMonthlySavings, totalAnnualSavings } = auditResult;

  if (!tools || tools.length === 0) {
    return "No tools were included in this audit, so there's nothing to summarize yet.";
  }

  const totalMonthlySpend = tools.reduce((sum, t) => sum + t.currentSpend, 0);
  const savingsPercent =
    totalMonthlySpend > 0
      ? Math.round((totalMonthlySavings / totalMonthlySpend) * 100)
      : 0;

  const highestCostTool = [...tools].sort(
    (a, b) => b.currentSpend - a.currentSpend,
  )[0];

  const sentences: string[] = [
    `You're currently spending $${totalMonthlySpend.toFixed(2)}/mo across ${tools.length} tool${tools.length === 1 ? "" : "s"}, with ${highestCostTool.toolName} the largest line item at $${highestCostTool.currentSpend.toFixed(2)}/mo.`,
  ];

  const opportunities = tools.filter(
    (t) => t.recommendedPlan || t.recommendedAlternative,
  );

  if (totalMonthlySavings > 0 && opportunities.length > 0) {
    const changes = opportunities
      .map((t) =>
        t.recommendedPlan
          ? `moving ${t.toolName} to ${t.recommendedPlan}`
          : `switching ${t.toolName} to ${t.recommendedAlternative}`,
      )
      .join(", ");

    sentences.push(
      `This audit found $${totalMonthlySavings.toFixed(2)}/mo ($${totalAnnualSavings.toFixed(2)}/yr) in potential savings — about ${savingsPercent}% of current spend — mainly by ${changes}.`,
    );
  } else {
    sentences.push(
      "Your current setup already looks well-matched to your usage, with no downgrade or switch opportunities identified.",
    );
  }

  return sentences.join(" ");
}

export default async function generateSummary(
  userInput: UserInput,
  auditResult: AuditResult,
): Promise<string> {
  try {
    if (!process.env.GROQ_API_KEY) {
      console.error(
        "GROQ_API_KEY is not set; returning deterministic fallback summary.",
      );
      return buildFallbackSummary(auditResult);
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `
      You are a SaaS spend auditor. A user has audited their tools and here are the results.

      Use case: ${userInput.useCase}

      Per-tool analysis:
      ${auditResult.tools.map(t =>
        `- ${t.toolName}: currently spending $${t.currentSpend}/mo
          ${t.recommendedPlan ? `→ Recommended plan: ${t.recommendedPlan}` : ""}
          ${t.recommendedAlternative ? `→ Recommended alternative: ${t.recommendedAlternative}` : ""}
          → Saves $${t.monthlySavings}/mo | Reason: ${t.reason}`
      ).join("\n")}

      Total monthly savings: $${auditResult.totalMonthlySavings}
      Total annual savings: $${auditResult.totalAnnualSavings}

      Write a concise 2-3 sentence summary of their situation and the biggest wins.
    `;

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
      console.error(
        "Groq response did not include summary content; returning deterministic fallback.",
      );
      return buildFallbackSummary(auditResult);
    }

    return content;
  } catch (err) {
    // Covers network failures, non-2xx responses, rate limiting, and any
    // other unexpected Groq SDK failure. Groq is an enhancement, not a hard
    // dependency for getting a usable audit.
    console.error(
      "AI summary generation failed; returning deterministic fallback:",
      err,
    );
    return buildFallbackSummary(auditResult);
  }
}
