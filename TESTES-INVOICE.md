# Como rodar os testes — Módulo Invoice

## Pré-requisitos

```bash
npm install
```

Os testes usam SQLite em memória. Se aparecer `Please install sqlite3 package manually`:

```bash
npm rebuild sqlite3
```

## Testes do módulo Invoice

```bash
npx jest src/modules/invoice
```

Resultado esperado: `Test Suites: 3 passed, 3 total`.

O que é coberto:

| Arquivo | Valida |
|---|---|
| `usecase/generate-invoice/generate-invoice.usecase.spec.ts` | geração da nota, total, persistência e erro sem itens |
| `usecase/find-invoice/find-invoice.usecase.spec.ts` | busca da nota, endereço, itens, total, `createdAt` e erro quando não encontrada |
| `facade/invoice.facade.spec.ts` | integração completa via `InvoiceFacadeFactory` (gerar → buscar) |
| `repository/invoice.repository.ts` | persistência SQL usada pelos specs acima |

## Rodar um teste específico

```bash
npx jest src/modules/invoice/facade
npx jest src/modules/invoice -t "should generate an invoice"
```

## Rodar tudo (unitários + E2E da API)

```bash
npm test
```

Esse comando executa `tsc --noEmit` (checagem de tipos) e depois `jest`.
Saída esperada: `Test Suites: 19 passed, 19 total` e `Tests: 32 passed, 32 total`.
