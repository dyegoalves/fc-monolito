import { Sequelize } from "sequelize-typescript";
import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../../domain/invoice-items.entity";
import Invoice from "../../domain/invoice.entity";
import InvoiceItemModel from "../../repository/invoice-item.model";
import InvoiceModel from "../../repository/invoice.model";
import InvoiceRepository from "../../repository/invoice.repository";
import FindInvoiceUseCase from "./find-invoice.usecase";

describe("Find Invoice Use Case test", () => {
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

  it("should find an invoice", async () => {
    const repository = new InvoiceRepository();
    const usecase = new FindInvoiceUseCase(repository);

    const invoice = new Invoice({
      id: new Id("1"),
      name: "Invoice 1",
      document: "1234-5678",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
      ),
      items: [
        new InvoiceItem({ id: new Id("1"), name: "Item 1", price: 10 }),
        new InvoiceItem({ id: new Id("2"), name: "Item 2", price: 20 }),
      ],
    });

    await repository.save(invoice);

    const result = await usecase.execute({ id: "1" });

    expect(result.id).toBe("1");
    expect(result.name).toBe(invoice.name);
    expect(result.document).toBe(invoice.document);
    expect(result.address.street).toBe(invoice.address.street);
    expect(result.address.number).toBe(invoice.address.number);
    expect(result.address.complement).toBe(invoice.address.complement);
    expect(result.address.city).toBe(invoice.address.city);
    expect(result.address.state).toBe(invoice.address.state);
    expect(result.address.zipCode).toBe(invoice.address.zipCode);
    expect(result.items).toEqual([
      { id: "1", name: "Item 1", price: 10 },
      { id: "2", name: "Item 2", price: 20 },
    ]);
    expect(result.total).toBe(30);
    expect(result.createdAt).toEqual(invoice.createdAt);
  });

  it("should throw when invoice is not found", async () => {
    const repository = new InvoiceRepository();
    const usecase = new FindInvoiceUseCase(repository);

    await expect(usecase.execute({ id: "invalid" })).rejects.toThrow(
      "Invoice not found"
    );
  });
});
