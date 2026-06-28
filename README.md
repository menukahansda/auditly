# Auditly

A free web app that helps startups understand and optimize their AI tool spending. It analyzes subscriptions like Cursor, ChatGPT, Claude, Copilot, and API usage, then generates an instant audit with potential savings and smarter plan recommendations.

## Live Demo
[Deployed App Link](https://auditly-tau.vercel.app/)

## Project Structure
``` text
Auditly/
├── app/
│   ├── layout.tsx
│   ├── page.tsx    
│   ├── global.css
│   ├── favicon.ico                
│   │
│   ├── audit/
│   │   ├── page.tsx                
│   │   ├── [id]/
│   │   │   └── page.tsx    
│   │        
│   ├── api/
│   │   ├── audit/
│   │   │   └── route.ts           
│   │   ├── lead/
│   │   │   └── route.ts            
│   │   ├── summary/
│   │   │   └── route.ts   
│   │        
│
├── components/
│   ├── forms/
│   │   ├── SpendForm.tsx      
│   │   ├── AddedTools.tsx     
│   │
│   ├── audit/
│   │   ├── AuditCard.tsx           
│   │   ├── AuditSummary.tsx        
│   │
│
├── docs/
│   ├── DEVLOG.md
│   ├── PRICING_DATA.md
│
├── hooks/
│   ├── useAudit.ts                                    
│   ├── useLocalStorage.ts   
│
├── lib/
│   ├── audit/
│   │   ├── engine.ts              
│   │   ├── pricing.ts             
│   │   ├── types.ts  
│   │   ├── constants.ts              
│   │
│   ├── db/
│   │   ├── supabase.ts             
│   │
│   ├── ai/
│   │   ├── summary.ts           
│
├── utils/
│   ├── validateInput.ts                               
│
├── screenshots/                                   
│
├── tests/
│   ├── audit.engine.test.ts     
│   ├── validation.test.ts          
│            
│
├── .env.local
├── next.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Screenshots
![Screenshot-1](Screenshots/screenshot-1.png)
![Screenshot-2](Screenshots/screenshot-2.png)
![Screenshot-3](Screenshots/screenshot-3.png)

## 🧠 What it does
- Collects AI tool usage, plans, monthly spend, and team size
- Evaluates whether the user is overpaying or under-optimized
- Suggests cheaper plans or better-suited alternatives
- Estimates monthly and yearly savings
- Generates a shareable audit result page with a unique URL

## ⚙️ How It Works

1. **Input Collection** — The user enters their AI tools, current plan, team size, monthly spend, and primary use case using a form.

2. **Audit Engine** — Each tool is evaluated individually against a set of rules:
   - Flags over-provisioned plans based on team size (e.g. Enterprise plans for small teams)
   - Suggests alternative tools based on use case (e.g. Cursor for coding-heavy teams, Claude for research)

3. **Savings Calculation** — The engine calculates the cost of the recommended plan or alternative and computes monthly and annual savings.

4. **AI Summary** — The audit result is passed to the Groq API, which generates a plain-English summary of findings.

5. **Shareable Report** — Results are saved and assigned a unique URL so the audit can be revisited or shared.

## 🛠 Tech Stack 
- Frontend: Next.js + TypeScript
- Styling: Tailwind CSS
- Backend: Next.js API routes
- Database: Supabase (PostgreSQL)
- AI: Groq API (for summary generation)

## 📦 Setup
```bash
git clone https://github.com/menukahansda/auditly.git
cd auditly
npm install
npm run dev
```

## Env variables
- GROQ_API_KEY=your_groq_api_key
- SUPABASE_URL=your_supabase_url
- SUPABASE_ANON_KEY=your_supabase_anon_key

## Author
Built by [Menuka Hansda](https://github.com/menukahansda)