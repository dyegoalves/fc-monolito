# fc-monolito — Invoice Module

Módulo de Invoice (Nota Fiscal) do monolito modular, exposto apenas via Facade.

## Estrutura

```
src/modules/invoice
├── domain          # Invoice, InvoiceItem e Address (Value Object)
├── gateway         # InvoiceGateway
├── repository      # Persistência SQL (Sequelize/SQLite)
├── usecase         # GenerateInvoiceUseCase, FindInvoiceUseCase
├── facade          # InvoiceFacade (fronteira do módulo)
└── factory         # InvoiceFacadeFactory
```

## Como rodar os testes

```bash
npm install
npm test
```

`npm test` roda a checagem de tipos (`tsc --noEmit`) e toda a suíte Jest.
Para rodar só o módulo de invoice:

```bash
npx jest src/modules/invoice
```
