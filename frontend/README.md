# Golden Raspberry Awards Frontend

Aplicação Angular que consome a API do Golden Raspberry Awards (backend em `localhost:3000`) e mostra os produtores com o menor e o maior intervalo entre duas vitórias.

## Pré-requisitos

- Node.js 20 ou superior (testado na versão 22)
- npm
- Backend rodando em `http://localhost:3000` (veja o README na raiz do projeto)

## Instalação

```bash
cd front-end
npm install
```

## Executando

```bash
npm start
```

O app sobe em `http://localhost:4200`. As chamadas para `/api/*` são encaminhadas para `http://localhost:3000` pelo `src/proxy.conf.json`, que remove o prefixo `/api`. Exemplo: `GET /api/awards/producers/intervals` chega no backend como `GET /awards/producers/intervals`.

O proxy só vale no servidor de desenvolvimento (`ng serve`). Em produção, o servidor web precisa fazer esse mesmo roteamento.

## Build

```bash
npm run build
```

A saída vai para `dist/golden-raspberry-front`.

## Endpoints consumidos

- `GET /awards/producers/intervals` (chamado como `/api/awards/producers/intervals`)
- `GET /ai/` (chamado como `/api/ai/`)

## Estrutura

- `src/main.ts`: bootstrap da aplicação
- `src/app/`: componente raiz (`app.ts`, `app.html`, `app.css`) e `app.config.ts`
- `src/proxy.conf.json`: proxy do servidor de desenvolvimento
- `angular.json`: configuração do projeto (inclui `proxyConfig` no `serve`)

Os componentes e serviços da funcionalidade ainda serão adicionados nas próximas tarefas.
