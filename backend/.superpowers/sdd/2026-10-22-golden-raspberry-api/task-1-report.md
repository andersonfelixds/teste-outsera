# Task 1 Report: Project Setup and Dependencies

## Arquivos criados
- /home/devcodes/projetos/backend/package.json
- /home/devcodes/projetos/backend/.gitignore
- /home/devcodes/projetos/backend/jest.config.js
- (gerados pelo npm) package-lock.json e node_modules/

## Conteúdo
- package.json: name golden-raspberry-api, version 1.0.0, main src/server.js, "type": "module". Dependências: express ^5.3.0, better-sqlite3 ^13.0.3, csv-parse ^7.0.3. Dev: jest ^30.5.2, supertest ^7.3.1. Scripts: start (node src/server.js) e test (NODE_OPTIONS=--experimental-vm-modules jest).
- .gitignore: node_modules/, *.log, .env, .DS_Store.
- jest.config.js: export default (ESM) com testEnvironment "node", testMatch ["**/tests/integration/**/*.test.js"], collectCoverage false.

## npm install
Sem erros. 364 pacotes adicionados, 365 auditados. Avisos: glob@10.5.0 deprecated e 19 vulnerabilidades moderate no npm audit (dependências transitivas, não investiguei). node -e "console.log(process.version)" retornou v22.23.1.

## Concerns e desvios
- O brief não especificava versões. Instalei com "*" e depois fixei com caret nas versões resolvidas.
- Os scripts start e test e o campo description não estavam no brief; adicionei porque jest em ESM precisa de --experimental-vm-modules. Não executei nenhum teste (ainda não existem).
- O script test usa sintaxe de variável de ambiente POSIX, não funciona no Windows cmd.
- Nada foi commitado.

## Resumo
npm install OK, 5 dependências instaladas, nenhum teste existente ainda.
