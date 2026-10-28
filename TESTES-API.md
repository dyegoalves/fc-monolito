# Como rodar os testes e usar a API

## Pré-requisitos

```bash
npm install
```

Os testes usam SQLite em memória. Se aparecer `Please install sqlite3 package manually`:

```bash
npm rebuild sqlite3
```

## Endpoints

Base: `http://localhost:3000`.

| Método | Rota | O que faz | Sucesso | Erro |
|---|---|---|---|---|
| `POST` | `/products` | cadastra produto (admin): `name`, `description`, `purchasePrice`, `salesPrice`, `stock` | `201` + produto criado | `400` |
| `POST` | `/clients` | cadastra cliente: `name`, `email`, `document`, `address` | `201` + cliente criado | `400` |
| `POST` | `/checkout` | compra: valida estoque, busca preço, gera nota e processa pagamento | `201` + `{ invoiceId, total, status }` | `400` |
| `GET` | `/invoice/:id` | consulta nota fiscal | `200` + nota | `404` |

Regras:
- `salesPrice` é opcional em `/products` (padrão: `purchasePrice`).
- `id` é gerado se não enviado em `/products` e `/clients`.
- `address` em `/clients` exige `street`, `number`, `complement`, `city`, `state`, `zipCode`.
- `/checkout` recebe `clientId` e `products: [{ productId }]`; exige estoque `> 0` e total `>= 100` (senão `400 Payment declined`).
- Erros retornam `{ "error": "..." }`.

## Subir o servidor

```bash
npm start                    # http://localhost:3000
PORT=4000 npm start          # outra porta
DB_STORAGE=meu.sqlite npm start  # outro arquivo SQLite (padrão: database.sqlite)
```

O banco e as tabelas são criados no primeiro start. Para começar limpo, apague `database.sqlite` antes de subir.

## Fluxo de criação

### 1. POST /products

```bash
curl -X POST localhost:3000/products \
  -H 'Content-Type: application/json' \
  -d '{"name":"Product 1","description":"desc","purchasePrice":100,"salesPrice":150,"stock":10}'
```

Resposta `201`: `{"id":"...","name":"Product 1","description":"desc","purchasePrice":100,"salesPrice":150,"stock":10}`

### 2. POST /clients

```bash
curl -X POST localhost:3000/clients \
  -H 'Content-Type: application/json' \
  -d '{"name":"Lucian","email":"lucian@xpto.com","document":"1234-5678","address":{"street":"Rua 123","number":"99","complement":"Casa Verde","city":"Criciúma","state":"SC","zipCode":"88888-888"}}'
```

Resposta `201`: `{"id":"...","name":"Lucian","email":"lucian@xpto.com","document":"1234-5678","address":{...}}`

### 3. POST /checkout

```bash
curl -X POST localhost:3000/checkout \
  -H 'Content-Type: application/json' \
  -d '{"clientId":"<CLIENT_ID>","products":[{"productId":"<PRODUCT_ID>"}]}'
```

Resposta `201`: `{"invoiceId":"...","total":150,"status":"approved"}`

### Fluxo de criação completo (encadeando os ids)

```bash
PRODUCT_ID=$(curl -s -X POST localhost:3000/products -H 'Content-Type: application/json' \
  -d '{"name":"Product 1","description":"desc","purchasePrice":100,"salesPrice":150,"stock":10}' \
  | python3 -c 'import json,sys;print(json.load(sys.stdin)["id"])')

CLIENT_ID=$(curl -s -X POST localhost:3000/clients -H 'Content-Type: application/json' \
  -d '{"name":"Lucian","email":"lucian@xpto.com","document":"1234-5678","address":{"street":"Rua 123","number":"99","complement":"Casa Verde","city":"Criciúma","state":"SC","zipCode":"88888-888"}}' \
  | python3 -c 'import json,sys;print(json.load(sys.stdin)["id"])')

INVOICE_ID=$(curl -s -X POST localhost:3000/checkout -H 'Content-Type: application/json' \
  -d "{\"clientId\":\"$CLIENT_ID\",\"products\":[{\"productId\":\"$PRODUCT_ID\"}]}" \
  | python3 -c 'import json,sys;print(json.load(sys.stdin)["invoiceId"])')

echo "$INVOICE_ID"
```

Guarde o `INVOICE_ID` para o fluxo de consulta.

## Fluxo de consulta

### GET /invoice/:id

```bash
curl localhost:3000/invoice/<INVOICE_ID>
```

Resposta `200`: `{"id":"...","name":"Lucian","document":"1234-5678","address":{...},"items":[{"id":"<PRODUCT_ID>","name":"Product 1","price":150}],"total":150,"createdAt":"..."}`

Nota inexistente → `404`: `{"error":"Invoice not found"}`

### Fluxo de consulta completo

```bash
curl localhost:3000/invoice/$INVOICE_ID
```

## Testes E2E da API

```bash
npx jest src/api
```

Resultado esperado: `Test Suites: 1 passed, 1 total`.

Sobe o app Express com Supertest e banco em memória — não precisa subir o servidor à mão.

O que é coberto (`src/api/api.e2e.spec.ts`):

| Teste | Rota | Espera |
|---|---|---|
| criar produto | `POST /products` | `201` + corpo com `id`, preços e `stock` |
| criar cliente | `POST /clients` | `201` + corpo com `id`, dados e `address` |
| comprar e consultar nota | `POST /checkout` → `GET /invoice/:id` | `201` com `invoiceId`/`total`/`status` e `200` com itens e `total` iguais |
| comprar o mesmo produto 2x | `POST /checkout` | `201` nas duas, ids de nota diferentes |
| nota inexistente | `GET /invoice/invalid` | `404` + `{ "error": "Invoice not found" }` |
| campos obrigatórios | `POST /products` vazio | `400` + mensagem de validação |

## Rodar um teste específico

```bash
npx jest src/api -t "should checkout and generate an invoice"
```

## Rodar tudo (unitários + E2E da API)

```bash
npm test
```

Esse comando executa `tsc --noEmit` (checagem de tipos) e depois `jest`.
Saída esperada: `Test Suites: 19 passed, 19 total` e `Tests: 33 passed, 33 total`.
