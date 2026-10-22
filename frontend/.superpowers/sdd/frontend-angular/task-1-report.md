# Task 1 Report: Angular setup

## ng new
Succeeded (Angular CLI 22.2.4, Node 22.23.1; `ng` was not installed globally, so `npx @angular/cli@latest` was used). Command: `ng new golden-raspberry-front --directory front-end --routing=false --style=css --ssr=false --skip-git --defaults`. The `--directory front-end` flag was used so the project lands in `/home/devcodes/projetos/backend/front-end/` (project name remains `golden-raspberry-front`).

## Proxy (`src/proxy.conf.json`)
```json
{
  "/api/*": {
    "target": "http://localhost:3000",
    "pathRewrite": { "^/api": "" },
    "changeOrigin": true
  }
}
```
`angular.json`: `projects.golden-raspberry-front.architect.serve.options.proxyConfig = "src/proxy.conf.json"`.

## Verification
`npm start` (timeout 40s) built and served: "Application bundle generation complete", "Local: http://localhost:4200/". `ng build` also succeeds after enabling strict. The proxy was not exercised against a live backend (no API call tested).

## Files
- /home/devcodes/projetos/backend/front-end/ (scaffold)
- /home/devcodes/projetos/backend/front-end/src/proxy.conf.json
- /home/devcodes/projetos/backend/front-end/angular.json (modified)
- /home/devcodes/projetos/backend/front-end/tsconfig.json (added `"strict": true`)
- /home/devcodes/projetos/backend/front-end/README.md (replaced the generated one)
- /home/devcodes/projetos/backend/README.md (Frontend section appended)

## Concerns
- The brief's "root" is `/home/devcodes/projetos/`, but that has no README and `front-end/` already existed (empty) inside `backend/`. I treated `backend/` as the project root.
- Generated tsconfig lacked `"strict": true`; I added it.
- The backend's `npm start` is documented as broken (no `src/server.js`), so the backend must be started another way for the proxy to work.
- `ng new` generated a large placeholder `app.html`; not touched. `.vscode/` and `.prettierrc` came with the scaffold. No git commit made.

## Summary
Angular project scaffolded in backend/front-end with strict mode, /api proxy to :3000, running on :4200, and both READMEs updated.
