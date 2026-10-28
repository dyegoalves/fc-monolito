import { Sequelize } from "sequelize-typescript";
import InvoiceItemModel from "../../repository/invoice-item.model";
import InvoiceModel from "../../repository/invoice.model";
import InvoiceRepository from "../../repository/invoice.repository";
import GenerateInvoiceUseCase from "./generate-invoice.usecase";

describe("Generate Invoice Use Case test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate an invoice", async () => {
    const repository = new InvoiceRepository();
    const usecase = new GenerateInvoiceUseCase(repository);

    const input = {
      name: "Invoice 1",
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipCode: "88888-888",
      items: [
        { id: "1", name: "Item 1", price: 19.9 },
        { id: "2", name: "Item 2", price: 20.1 },
      ],
    };

    const result = await usecase.execute(input);

    expect(result.id).toBeDefined();
    expect(result.name).toBe(input.name);
    expect(result.document).toBe(input.document);
    expect(result.street).toBe(input.street);
    expect(result.number).toBe(input.number);
    expect(result.complement).toBe(input.complement);
    expect(result.city).toBe(input.city);
    expect(result.state).toBe(input.state);
    expect(result.zipCode).toBe(input.zipCode);
    expect(result.items).toEqual(input.items);
    expect(result.total).toBe(40);

    const invoiceDb = await InvoiceModel.findOne({
      where: { id: result.id },
      include: [InvoiceItemModel],
    });

    expect(invoiceDb).toBeDefined();
    expect(invoiceDb.name).toBe(input.name);
    expect(invoiceDb.items.length).toBe(2);
  });

  it("should throw when invoice has no items", async () => {
    const repository = new InvoiceRepository();
    const usecase = new GenerateInvoiceUseCase(repository);

    await expect(
      usecase.execute({
        name: "Invoice 1",
        document: "1234-5678",
        street: "Rua 123",
        number: "99",
        complement: "Casa Verde",
        city: "Criciúma",
        state: "SC",
        zipCode: "88888-888",
        items: [],
      })
    ).rejects.toThrow("Invoice must have at least one item");
  });
});
