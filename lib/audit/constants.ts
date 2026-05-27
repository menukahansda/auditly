export const PRIMARY_USE_CASES = [
  "coding",
  "writing",
  "data",
  "research",
  "mixed",
] as const;

export const TOOL_PLANS = {
  Cursor: ["Hobby", "Pro", "Pro+", "Ultra", "Team", "Enterprise"],
  "GitHub Copilot": ["Free", "Pro", "Pro+", "Business", "Enterprise"],
  Claude: ["Free", "Pro", "Max", "Team", "Enterprise", "API direct"],
  ChatGPT: ["Free", "Go", "Plus", "Pro", "Business", "Enterprise", "API direct"],
  Anthropic: ["API direct"],
  OpenAI: ["API direct"],
  Gemini: ["Free", "Plus", "Pro", "Ultra", "API"],
  Windsurf: ["Free", "Pro", "Max", "Team"]
} as const;