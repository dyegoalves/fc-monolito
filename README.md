# fc-monolito

Monólito modular em TypeScript com Express, no padrão Facade + Factory por módulo.

## Módulos

| Módulo | Responsabilidade |
|---|---|
| `client-adm` | cadastro e consulta de clientes |
| `product-adm` | cadastro de produtos e controle de estoque |
| `store-catalog` | catálogo de produtos e preços de venda |
| `payment` | processamento de pagamentos |
| `invoice` | geração e consulta de notas fiscais |
| `checkout` | orquestra a compra: estoque → catálogo → nota → pagamento |
| `@shared` | entidades base, `Id` e Value Object `Address` |

Cada módulo expõe apenas sua Facade (`facade/`) e cria instâncias pela factory (`factory/`). A persistência usa Sequelize + SQLite.

## API (Express)

| Método | Rota | O que faz |
|---|---|---|
| `POST` | `/products` | cadastra produto |
| `POST` | `/clients` | cadastra cliente |
| `POST` | `/checkout` | realiza a compra e gera a nota |
| `GET` | `/invoice/:id` | consulta a nota fiscal |

Código em `src/api/`.

## Documentação

| Exercício | Enunciado | Como testar |
|---|---|---|
| Módulo de Invoice | `docs/invoce.md` | `TESTES-INVOICE.md` |
| API + E2E | `docs/api-create.md` | `TESTES-API.md` |

## Como rodar

```bash
npm install
npm start   # API em http://localhost:3000
npm test    # tipos + testes unitários + E2E
```

## Testes

```bash
npm test                        # tipos + unitários + E2E
npx jest src/modules/invoice    # somente testes do módulo Invoice
npx jest src/api                # somente testes E2E da API
```

Passo a passo de cada suíte:

- `TESTES-INVOICE.md` — testes do módulo Invoice.
- `TESTES-API.md` — endpoints, subir o servidor, fluxos com curl e testes E2E.

`npm test` roda `tsc --noEmit` + Jest (unitários e E2E com Supertest).
