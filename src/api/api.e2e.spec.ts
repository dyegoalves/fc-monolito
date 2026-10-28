import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import createApp from "./app";
import createConnection from "./database";

describe("API E2E test", () => {
  let sequelize: Sequelize;
  let app: ReturnType<typeof createApp>;

  beforeEach(async () => {
    sequelize = createConnection();
    await sequelize.sync({ force: true });
    app = createApp();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  const clientInput = {
    name: "Lucian",
    email: "lucian@xpto.com",
    document: "1234-5678",
    address: {
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipCode: "88888-888",
    },
  };

  const productInput = {
    name: "Product 1",
    description: "Product 1 description",
    purchasePrice: 100,
    salesPrice: 150,
    stock: 10,
  };

  async function createProduct() {
    const response = await request(app).post("/products").send(productInput);
    return response.body;
  }

  async function createClient() {
    const response = await request(app).post("/clients").send(clientInput);
    return response.body;
  }

  it("should create a product", async () => {
    const response = await request(app).post("/products").send(productInput);

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe(productInput.name);
    expect(response.body.description).toBe(productInput.description);
    expect(response.body.purchasePrice).toBe(productInput.purchasePrice);
    expect(response.body.salesPrice).toBe(productInput.salesPrice);
    expect(response.body.stock).toBe(productInput.stock);
  });

  it("should create a client", async () => {
    const response = await request(app).post("/clients").send(clientInput);

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe(clientInput.name);
    expect(response.body.email).toBe(clientInput.email);
    expect(response.body.document).toBe(clientInput.document);
    expect(response.body.address).toEqual(clientInput.address);
  });

  it("should checkout and generate an invoice", async () => {
    const product = await createProduct();
    const client = await createClient();

    const response = await request(app)
      .post("/checkout")
      .send({ clientId: client.id, products: [{ productId: product.id }] });

    expect(response.status).toBe(201);
    expect(response.body.invoiceId).toBeDefined();
    expect(response.body.total).toBe(product.salesPrice);
    expect(response.body.status).toBe("approved");

    const invoiceResponse = await request(app).get(
      `/invoice/${response.body.invoiceId}`
    );

    expect(invoiceResponse.status).toBe(200);
    expect(invoiceResponse.body.id).toBe(response.body.invoiceId);
    expect(invoiceResponse.body.name).toBe(client.name);
    expect(invoiceResponse.body.document).toBe(client.document);
    expect(invoiceResponse.body.address).toEqual(client.address);
    expect(invoiceResponse.body.items).toEqual([
      { id: product.id, name: product.name, price: product.salesPrice },
    ]);
    expect(invoiceResponse.body.total).toBe(product.salesPrice);
    expect(invoiceResponse.body.createdAt).toBeDefined();
  });

  it("should checkout the same product more than once", async () => {
    const product = await createProduct();
    const client = await createClient();
    const body = { clientId: client.id, products: [{ productId: product.id }] };

    const first = await request(app).post("/checkout").send(body);
    const second = await request(app).post("/checkout").send(body);

    expect(first.status).toBe(201);
    expect(second.status).toBe(201);
    expect(second.body.invoiceId).not.toBe(first.body.invoiceId);
  });

  it("should return 404 when invoice does not exist", async () => {
    const response = await request(app).get("/invoice/invalid");

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Invoice not found");
  });

  it("should validate required fields", async () => {
    const response = await request(app).post("/products").send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("Missing required fields");
  });
});
