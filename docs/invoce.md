Sistemas Monolíticos: Criação do Módulo de Invoice
Objetivo
Neste desafio, você deve implementar um módulo completamente novo dentro do sistema monolítico: o Módulo de Invoice (Nota Fiscal). O objetivo é encapsular toda a lógica de faturamento, respeitando os limites arquiteturais do módulo e expondo suas funcionalidades apenas através de uma Facade.

Tecnologias e Padrões
Linguagem: TypeScript
Arquitetura: Modular Monolith
Componentes: Facade, Factory, Domain, Gateway, Repository e Use Cases.
Base do Projeto: Repositório Template (Obrigatório)
Estrutura Base (Obrigatória)
Para realizar este desafio, é obrigatório utilizar o código base disponibilizado pelo curso.

Repositório base: https://github.com/devfullcycle/fc-monolito

Requisitos Técnicos
Para que o módulo seja considerado completo, você deve implementar os seguintes componentes internos:

Domain
Entidade Invoice: Deve conter id, name, document, address (Value Object), items (Entity), createdAt e updatedAt.
Entidade InvoiceItems: Deve conter id, name e price.
Value Object Address: Campos de endereço padrão.
Camada de Aplicação (Use Cases)
GenerateInvoiceUseCase: Responsável por criar uma nota fiscal.
FindInvoiceUseCase: Responsável por buscar uma nota fiscal.
Camada de Infraestrutura
Repository: Implementação da persistência (pode ser In-Memory ou SQL, conforme o padrão do curso).
Fronteira do Módulo
Facade: Interface pública para comunicação com outros módulos.
Factory: Fábrica para criação da Facade.
Contratos (DTOs) Obrigatórios
Você deve seguir estritamente as interfaces de entrada e saída abaixo para os Use Cases:

1. FindInvoiceUseCase

export interface FindInvoiceUseCaseInputDTO {
id: string;
}

export interface FindInvoiceUseCaseOutputDTO {
id: string;
name: string;
document: string;
address: {
street: string;
number: string;
complement: string;
city: string;
state: string;
zipCode: string;
};
items: {
id: string;
name: string;
price: number;
}[];
total: number;
createdAt: Date;
} 2. GenerateInvoiceUseCase

export interface GenerateInvoiceUseCaseInputDto {
name: string;
document: string;
street: string;
number: string;
complement: string;
city: string;
state: string;
zipCode: string;
items: {
id: string;
name: string;
price: number;
}[];
}

export interface GenerateInvoiceUseCaseOutputDto {
id: string;
name: string;
document: string;
street: string;
number: string;
complement: string;
city: string;
state: string;
zipCode: string;
items: {
id: string;
name: string;
price: number;
}[];
total: number;
}
Requisitos de Testes (Obrigatório)
A implementação deve estar coberta por testes automatizados.
Os testes devem validar o funcionamento dos Use Cases e a integração com a Facade.
Entregável
Link do Repositório: O link para o seu repositório no GitHub contendo o código completo do módulo.
README: Instruções de como rodar os testes.
Regras de Entrega
Repositório Único: É obrigatória a entrega de apenas um projeto por repositório.
Branch Principal: Todo o código deve estar na branch main.
Base Obrigatória: Projetos que não seguirem a estrutura base não serão aceitos.
