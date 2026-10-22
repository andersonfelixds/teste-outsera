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

## 📚 Documentação

- **[Backend API](./backend/README.md)** — Endpoints, database, CSV format, testing
- **[Frontend Angular](./frontend/README.md)** — Setup, components, proxy configuration

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

## 🔗 API Endpoints

- `GET /awards/producers/intervals` — Produtores com menor/maior intervalo
- `GET /ai/` — Histórico de interações de IA

## 📝 Notas

- Sem commits ainda (aguardando validação 100%)
- Database é in-memory; reiniciar backend recarrega dados do CSV
- Proxy configurado para desenvolvimento local
- CORS habilitado para requisições cross-origin
