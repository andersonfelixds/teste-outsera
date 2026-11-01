# Golden Raspberry Awards — Full Stack

Sistema completo (API + Frontend) para análise de Prêmios Golden Raspberry Awards (Razzies).

## 📁 Estrutura do Projeto

```
/home/devcodes/projetos/
├── backend/          ← API Node.js/Express (porta 3000)
│   ├── src/
│   ├── data/Movielist.csv
│   ├── package.json
│   └── README.md     ← Documentação completa da API
│
├── frontend/         ← Aplicação Angular (porta 4200)
│   ├── src/
│   ├── package.json
│   └── README.md     ← Documentação completa do Frontend
│
└── README.md         ← Este arquivo
```

## 🚀 Quick Start

### Terminal 1 — Backend (API)

```bash
cd /home/devcodes/projetos/backend
npm install
npm start
```

Backend rodará em `http://localhost:3000`

### Terminal 2 — Frontend (Angular)

```bash
cd /home/devcodes/projetos/frontend
npm install
npm start
```

Frontend rodará em `http://localhost:4200`

## 📚 Documentação Centralizada

- **[Backend API](./backend/README.md)** — Documentação completa
- **[Frontend Angular](./frontend/README.md)** — Documentação completa

## 🗄️ Dados

O arquivo `backend/data/Movielist.csv` contém:
- 343 filmes (Golden Raspberry Awards)
- 72 vencedores
- Campos: ano, título, estúdios, produtores, vencedor

## 🛠️ Tech Stack

**Backend:**
- Node.js 18+
- Express 5
- SQLite (in-memory, better-sqlite3)
- Jest (testes)

**Frontend:**
- Angular 22
- TypeScript (strict mode)
- HttpClient + RxJS
- CSS puro

## 📊 Funcionalidades

✅ Leitura de CSV com parsing de produtores  
✅ Cálculo de intervalos min/max entre prêmios  
✅ Exibição em tabelas interativas  
✅ Histórico de interações de IA (logging)  
✅ Testes de integração (backend)  
✅ TypeScript strict em ambos os lados  

## 🔗 Endpoints e URLs

### Backend (API)
A API está disponível em `http://localhost:3000` quando o backend está rodando.

**Endpoints principais:**
- `GET http://localhost:3000/awards/producers/intervals` — Produtores com menor/maior intervalo
- `GET http://localhost:3000/ai/` — Histórico de interações de IA

**📚 Documentação Interativa (Swagger):** `http://localhost:3000/api-docs`

### Frontend (Web)
A aplicação Angular está disponível em `http://localhost:4200` quando o frontend está rodando.

---

## 🔧 Backend — Detalhes Técnicos

### Pré-requisitos
- Node.js 18 ou superior (Express 5 requer Node 18+)
- npm

### Instalação e Execução

```bash
cd backend
npm install
npm start
```

### Testes

```bash
npm test
```

Testes de integração com Jest + Supertest. Total: **12 testes**, todos passando.

### API Endpoints - Exemplos de Resposta

#### `GET /awards/producers/intervals`

Retorna produtores com o menor e maior intervalo entre vitórias consecutivas.

**Resposta de sucesso:**
```json
{
  "min": [
    {
      "producer": "Bo Derek",
      "interval": 6,
      "previousWin": 1984,
      "followingWin": 1990
    }
  ],
  "max": [
    {
      "producer": "Matthew Vaughn",
      "interval": 13,
      "previousWin": 2002,
      "followingWin": 2015
    }
  ]
}
```

#### `GET /ai/`

Retorna histórico de interações com ferramentas de IA (mais recentes primeiro).

**Resposta quando vazio:**
```json
{
  "interactions": []
}
```

**Resposta com dados:**
```json
{
  "interactions": [
    {
      "id": 1,
      "timestamp": "2026-10-22T12:00:00.000Z",
      "tool_name": "Claude Code",
      "skill_name": "brainstorming",
      "prompt": "Plan the API design",
      "result": "Design approved"
    }
  ]
}
```

### Banco de Dados

- **Tipo:** SQLite em memória (`better-sqlite3`)
- **Tabelas:** `movies` (filmes/vitórias) e `ai_interactions` (histórico de IA)
- **Ciclo de vida:** Criado ao iniciar, carregado do CSV, descartado ao parar
- **Dados:** Recarregados automaticamente do CSV a cada restart

### Formato CSV

O arquivo `data/Movielist.csv` segue o formato:
- **Separador:** `;`
- **Cabeçalho:** `year;title;studios;producers;winner`
- **Produtores:** Múltiplos valores separados por `, ` (cada um contabilizado individualmente)
- **Vencedor:** `yes` para vencedores, vazio para não-vencedores
- **Validação:** Anos devem ser numéricos

**Exemplo:**
```
year;title;studios;producers;winner
1980;Can't Stop the Music;Associated Film Distribution;Allan Carr;yes
1980;Cruising;Lorimar Productions, United Artists;Jerry Weintraub;
```

### Estrutura de Diretórios (Backend)

```
backend/
├── data/
│   └── Movielist.csv           ← Dados de entrada
├── src/
│   ├── app.js                  ← Express app principal
│   ├── database.js             ← Setup SQLite em memória
│   ├── swagger.js              ← Configuração Swagger
│   ├── routes/
│   │   ├── awardsRoutes.js      ← GET /awards/*
│   │   └── aiRoutes.js          ← GET /ai/*
│   └── services/
│       ├── csvLoader.js         ← Lê e parseia CSV
│       ├── producerService.js   ← Cálcula intervalos
│       └── aiInteractionService.js ← Gerencia IA
├── tests/
│   └── integration/
│       ├── setup.js             ← Setup teste
│       ├── awards.test.js       ← Testes endpoints
│       └── aiInteractions.test.js
├── package.json
└── README.md
```

---

## 🎨 Frontend — Detalhes Técnicos

### Pré-requisitos
- Node.js 20 ou superior (testado em 22)
- npm
- Backend rodando em `http://localhost:3000`

### Instalação e Execução

```bash
cd frontend
npm install
npm start
```

O app sobe em `http://localhost:4200`. As requisições para `/api/*` são encaminhadas para o backend via proxy (`src/proxy.conf.json`).

### Build para Produção

```bash
npm run build
```

Saída: `dist/golden-raspberry-front/`

### Proxy de Desenvolvimento

O `proxy.conf.json` redireciona:
- `GET /api/awards/producers/intervals` → `http://localhost:3000/awards/producers/intervals`
- `GET /api/ai/` → `http://localhost:3000/ai/`

O proxy só funciona em desenvolvimento. Em produção, o servidor web precisa fazer esse roteamento.

### Estrutura de Diretórios (Frontend)

```
frontend/
├── src/
│   ├── main.ts               ← Bootstrap
│   ├── app/
│   │   ├── app.ts            ← Componente raiz
│   │   ├── app.html          ← Template
│   │   ├── app.css           ← Estilos
│   │   ├── app.config.ts     ← Configuração
│   │   └── services/
│   │       └── api.service.ts ← Cliente HTTP
│   └── proxy.conf.json       ← Proxy dev
├── angular.json              ← Configuração Angular
├── package.json
└── README.md
```

### Endpoints Consumidos

- `GET /awards/producers/intervals` — Intervalos de produtores
- `GET /ai/` — Histórico de IA

---

## 📝 Notas Gerais

- Database é in-memory; reiniciar backend recarrega dados do CSV
- CORS habilitado para requisições cross-origin
- Sem commits ainda (aguardando validação 100%)
- TypeScript strict mode em ambos backend e frontend
