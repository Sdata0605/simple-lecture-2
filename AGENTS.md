# Project Instructions

## Local run (port 8082)

When the user says **run this project**, start **this folder** locally on **port 8082** using `.cursor/skills/run-simple-lecture/`. Windows: `run-dev.ps1`. Linux/macOS: `run-dev.sh`. Or `npm run dev:local`. Open http://localhost:8082.

This 8082 runner is **local only**. Do not change production: keep `vite.config.ts` `server.port` at 8080, keep `.cursor/environment.json` start on 8080, and keep `npm run build` / deploy unchanged.

## Supabase Edge Functions

- Any change to a file under `supabase/functions/<function-name>/` MUST be automatically deployed live to Supabase Cloud project `oxwhqvsoelqqsblmqkxx` before finishing the task.
- Deployment command:
  `npx supabase functions deploy <function-name> --project-ref oxwhqvsoelqqsblmqkxx --no-verify-jwt`
- Use the `SUPABASE_ACCESS_TOKEN` environment variable.
- Preserve the function's `verify_jwt` setting from `supabase/config.toml`.
- Confirm deployment success in the final turn summary.
