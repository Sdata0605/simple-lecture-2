---
name: run-simple-lecture
description: Run this Simple Lecture folder locally on port 8082. Use whenever the user says "run this project", start the app, or launch the local dev server. Local development only — never use this for production.
---

# Run Simple Lecture locally (port 8082)

When the user says **run this project** (or start/launch the local app):

1. Run **this repo folder** with the skill script below.
2. Always use port **8082**.
3. Use this on **local machines only**. Do not change production deploy settings, production build output, or the cloud start command.

## Do not change production

Leave these production / default server settings as they are:

- `vite.config.ts` `server.port` (`8080`)
- `.cursor/environment.json` `start` (cloud agents)
- `npm run dev`, `npm run build`, and deploy docs

Local 8082 is an override via CLI flags / this skill, not a production config change.

## How to start

From the repo root:

**Windows (local PC):**

```powershell
powershell -ExecutionPolicy Bypass -File .cursor/skills/run-simple-lecture/scripts/run-dev.ps1
```

**Linux / macOS:**

```bash
bash .cursor/skills/run-simple-lecture/scripts/run-dev.sh
```

Equivalent npm script (local only): `npm run dev:local`

The app is ready at **http://localhost:8082**.

## Agent checklist

- If something is already listening on 8082, stop it, then start again with the script.
- Install `node_modules` only when missing.
- Do not start the default `npm run dev` (8080) when the user asked to run this project.
- Do not point production or CI at 8082.
