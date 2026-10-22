# Task 1: Project Setup and Dependencies

**Position in project:** Initial bootstrap — creates the Node.js project structure and configuration files needed for all subsequent tasks.

**Files to create/modify:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `jest.config.js`

**What this task produces:**

- `package.json` with dependencies: `express`, `better-sqlite3`, `csv-parse`; dev dependencies: `jest`, `supertest`. Must include `"type": "module"` for ES modules.
- `.gitignore` with standard Node.js ignores: `node_modules/`, `*.log`, `.env`, `.DS_Store`.
- `jest.config.js` configured with `testEnvironment: "node"`, `testMatch: ["**/tests/integration/**/*.test.js"]`, coverage disabled.

**Global Constraints:**
- Language: Node.js (JavaScript)
- ES modules required (`"type": "module"` in package.json)
- Testing framework: Jest

**Steps:**

1. Create `package.json` with the exact structure (name: "golden-raspberry-api", version: "1.0.0", main: "src/server.js")
2. Create `.gitignore` with Node ignores
3. Create `jest.config.js` with the specified configuration
4. Run `npm install` to verify no errors
5. Do NOT commit yet — code ready for validation

**Testing:**
- Run `npm install` and verify all packages install without errors
- Verify `node -e "console.log(process.version)"` works
