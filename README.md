# fc-monolito

Monólito modular (TypeScript + Express) com os módulos `client-adm`, `product-adm`, `store-catalog`, `payment`, `invoice` e `checkout`, cada um exposto apenas por sua Facade.

## Estrutura

```
src/modules/<módulo>
├── domain          # Entidades e Value Objects
├── gateway         # Contratos de persistência
├── repository      # Persistência SQL (Sequelize/SQLite)
├── usecase         # Casos de uso
├── facade          # Fronteira pública do módulo
└── factory         # Fábrica da Facade
src/api             # Camada HTTP (Express): app, rotas e conexão
```

## Como rodar

```bash
npm install
npm start            # sobe a API em http://localhost:3000 (PORT para trocar)
npm test             # tsc --noEmit + testes unitários e E2E (Jest + Supertest)
```

Para rodar só os testes E2E da API:

```bash
npx jest src/api
```

O banco é SQLite: `database.sqlite` ao subir a API; `:memory:` nos testes.

Detalhes de como rodar os testes: `TESTES-INVOICE.md` (módulo Invoice) e `TESTES-API.md` (E2E da API).

## Endpoints

### POST /products

```json
{
  "name": "Product 1",
  "description": "Product 1 description",
  "purchasePrice": 100,
  "salesPrice": 150,
  "stock": 10
}
```

`salesPrice` é opcional (padrão: `purchasePrice`). Resposta `201`:

```json
{ "id": "...", "name": "Product 1", "description": "...", "purchasePrice": 100, "salesPrice": 150, "stock": 10 }
```

### POST /clients

```json
{
  "name": "Lucian",
  "email": "lucian@xpto.com",
  "document": "1234-5678",
  "address": {
    "street": "Rua 123",
    "number": "99",
    "complement": "Casa Verde",
    "city": "Criciúma",
    "state": "SC",
    "zipCode": "88888-888"
  }
}
```

Resposta `201` com o cliente criado (`id`, `name`, `email`, `document`, `address`).

### POST /checkout

```json
{ "clientId": "...", "products": [{ "productId": "..." }] }
```

Valida estoque (`product-adm`), busca preço no catálogo (`store-catalog`), gera a nota (`invoice`) e processa o pagamento (`payment`). Resposta `201`:

```json
{ "invoiceId": "...", "total": 150, "status": "approved" }
```

Regra de pagamento herdada do módulo `payment`: valores `>= 100` são aprovados; abaixo disso a compra é recusada (`400`).

### GET /invoice/:id

Resposta `200` com a nota fiscal (`id`, `name`, `document`, `address`, `items`, `total`, `createdAt`) ou `404` se não existir.

Erros de validação/negócio retornam `400` com `{ "error": "..." }`.
