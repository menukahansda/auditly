import Groq from "groq-sdk";
import { UserInput, AuditResult } from "@/lib/audit/types";

export default async function generateSummary(
  userInput: UserInput, 
  auditResult: AuditResult,
): Promise<string> {
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

  return response.choices[0].message.content ?? "";
}
