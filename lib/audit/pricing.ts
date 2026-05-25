import {ToolName, Plan} from "./types";

export const PRICING: Record<ToolName, Partial<Record<Plan, number>>> = {
    "Cursor": {
        "Hobby": 0,
        "Pro": 20,
        "Pro+": 60,
        "Ultra": 200,
        "Team": 40,
        "Enterprise": 0, // custom pricing , contact sales at https://cursor.com/contact-sales?source=pricing_enterprise
    },

    "GitHub Copilot": {
        "Free": 0,
        "Pro": 10,
        "Pro+": 39,
        "Business": 19,
        "Enterprise": 39,
    },

    "Claude": {
        "Free": 0,
        "Pro": 17,
        "Max": 100,
        "Team": 20,        
        "Enterprise": 0, // usage-based pricing 
        "API direct": 0, // token-based pricing, see https://claude.com/pricing#api  for details
    },

    "ChatGPT": {
        "Free": 0,
        "Go": 4,             // ~399 inr 
        "Plus": 21,         // ~1999 inr
        "Pro": 112,          // ~10,699 inr 
        "Business": 19, // Usage-based, ~1800 inr 
        "Enterprise": 0, // custom pricing, contact sales at https://chatgpt.com/contact-sales
        "API direct": 0, // token-based pricing
    },

    "Anthropic": {
        "API direct": 0, // usage-based pricing
    },

    "OpenAI": {
        "API direct": 0, // usage-based pricing
    },

    "Gemini": {
        "Free": 0,
        "Plus": 4,
        "Pro": 20,
        "Ultra": 68,
        "API": 0, // usage-based pricing
    },

    "Windsurf": {
        "Free": 0,
        "Pro": 20,
        "Max": 200,
        "Team": 40,
        "Enterprise": 0, // custom pricing, contact sales at https://windsurf.com/enterprise/contact
    }
};
// Cursor (Hobby / Pro / Business / Enterprise)
//  GitHub Copilot (Individual / Business / Enterprise)
//  Claude (Free / Pro / Max / Team / Enterprise / API direct)
//  ChatGPT (Plus / Team / Enterprise / API direct)
//  Anthropic API direct
//  OpenAI API direct
//  Gemini (Pro / Ultra / API)
//  Windsurf or

 