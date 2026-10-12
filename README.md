# Profe — adaptive Ecuadorian Spanish voice tutor

Multiuser web app using Supabase Auth, private learner memory, and an OpenAI Realtime WebRTC voice connection. The previous n8n integration has been removed.

## Current state
- The root `index.html` is the new Supabase-authenticated browser application.
- `server/index.js` is the required Node backend for voice; **GitHub Pages alone cannot run it**.
- Learner profiles and session transcripts are stored under Supabase row-level security.
- Adaptive post-session assessment, spaced-repetition updates, deployment, and end-to-end tests are still outstanding.

## Deploy
1. Use a Node 20+ hosting platform supporting HTTPS and environment variables.
2. Set `OPENAI_API_KEY` as a **server-side secret**. API usage is billed separately from ChatGPT Plus.
3. Install dependencies with `npm install` and run `npm start`.
4. Configure Supabase Auth Site URL and redirect allowlist for your deployed domain.
5. Test registration, email verification, authentication, voice, RLS and transcript saving.

Never commit an OpenAI API key or a Supabase service-role key. Before public launch, add rate limiting, quotas, spend controls, monitoring and transcript recovery.
