# Auditly

A free web app that helps startups understand and optimize their AI tool spending. It analyzes subscriptions like Cursor, ChatGPT, Claude, Copilot, and API usage, then generates an instant audit with potential savings and smarter plan recommendations.

This project is being built as part of an assignment.

## Live Demo
[Deployed App Link](https://auditly-tau.vercel.app/)

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

## 🛠 Tech Stack (Planned / In Progress)
- Frontend: Next.js + TypeScript
- Styling: Tailwind CSS
- Backend: To be decided (likely API routes )
- Database: TBD (likely PostgreSQL)
- AI: Anthropic / OpenAI API (for summary generation)

## 📦 Setup (WIP)
```bash
git clone https://github.com/menukahansda/auditly.git
cd auditly
npm install
npm run dev