# Sistemas Monolíticos: API e Testes End-to-End

## Objetivo

Agora que os Use Cases dos módulos estão prontos, é hora de expor essas funcionalidades para o mundo externo. Neste desafio, você deve implementar a Camada de API (Web) do seu monólito, criando os endpoints necessários para que seja possível realizar o fluxo completo de uma compra via requisições HTTP.

---

## Tecnologias e Ferramentas

- **Linguagem:** TypeScript
- **Framework Web:** Express
- **Testes E2E:** Supertest
- **Base do Projeto:** Repositório Template (Obrigatório)

---

## Estrutura Base (Obrigatória)

Para realizar este desafio, é obrigatório utilizar o código base disponibilizado pelo curso (continuando o desenvolvimento do desafio anterior).

Repositório base: [https://github.com/devfullcycle/fc-monolito](https://github.com/devfullcycle/fc-monolito)

---

## Requisitos Técnicos

Você deve disponibilizar as seguintes rotas na API (Rest):

### Products

- `POST /products`: Cadastro de produtos.

### Clients

- `POST /clients`: Cadastro de clientes.

### Checkout

- `POST /checkout`: Realização da compra (deve processar o pedido).

### Invoice

- `GET /invoice/{id}`: Consulta de uma Nota Fiscal gerada.

---

## Requisitos de Testes (Obrigatório)

- **Ferramenta:** Utilize a biblioteca Supertest para realizar os testes End-to-End (E2E).
- **Cobertura:** Todos os endpoints listados acima devem possuir testes que validem o status code (200/201) e o corpo da resposta.
- **Execução:** A suíte de testes deve rodar com o comando padrão:

```
npm run test
```

(Certifique-se de que este comando execute tanto os testes unitários quanto os E2E).

**Dica:** Caso tenha dúvidas sobre como configurar o Supertest, consulte o módulo de Clean Architecture na seção "Camada de API".

---

## Entregável

1. **Link do Repositório:** O link para o seu repositório no GitHub contendo a implementação da API e dos testes.
2. **README:** Instruções de execução.

---

## Regras de Entrega

1. **Repositório Único:** É obrigatória a entrega de apenas um projeto por repositório.
2. **Branch Principal:** Todo o código deve estar na branch `main`.
3. **Base Obrigatória:** Projetos que não seguirem a estrutura base não serão aceitos.
