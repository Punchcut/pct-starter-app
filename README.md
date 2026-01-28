# PCT Starter App

A minimal Next.js starter. It includes basic structure and one AI-powered feature (a short poem you can regenerate) so you can play with the code and add your own ideas.

## What’s in the box

- **Next.js** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** and **ShadCN** for UI
- **OpenAI** (Responses API, GPT-5 Mini) for the poem feature
- **Bulletproof React–style** layout: `src/features/`, `src/components/ui/`, `src/lib/`

See [AGENTS.md](./AGENTS.md) for structure and conventions (and for AI/agent steering).

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set your OpenAI API key**

   Create a `.env` file in the project root and set `OPENAI_API_KEY` (get one at [platform.openai.com/api-keys](https://platform.openai.com/api-keys)).

3. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). You’ll see a card titled **Punchcut Starter App** with a short poem about this starter app and a **Re-generate description** button to generate a new poem with AI.

## Project structure

- **`src/app/`** – Routes and layout (including the `/api/poem` route for poem generation)
- **`src/features/poem/`** – Poem feature: `PoemCard` component, client-side `generatePoem` that calls the API route
- **`src/components/ui/`** – Shared UI (e.g. ShadCN Button, Card)
- **`src/lib/`** – Shared utilities

New features go under `src/features/<name>/` with their own `api/`, `components/`, and `index.ts`. See AGENTS.md for details.

## Learn more

- [Next.js docs](https://nextjs.org/docs)
- [ShadCN UI](https://ui.shadcn.com/) – add components with `npx shadcn@latest add <component>`
- [OpenAI API](https://platform.openai.com/docs) – Responses API used for the poem
