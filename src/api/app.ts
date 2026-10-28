import express, { NextFunction, Request, Response } from "express";
import Address from "../modules/@shared/domain/value-object/address";
import Id from "../modules/@shared/domain/value-object/id.value-object";
import CheckoutFacadeFactory from "../modules/checkout/factory/checkout.facade.factory";
import ClientAdmFacadeFactory from "../modules/client-adm/factory/client-adm.facade.factory";
import InvoiceFacadeFactory from "../modules/invoice/factory/invoice.facade.factory";
import ProductAdmFacadeFactory from "../modules/product-adm/factory/facade.factory";

type Handler = (req: Request, res: Response) => Promise<void>;

function asyncHandler(handler: Handler) {
  return (req: Request, res: Response, next: NextFunction) =>
    handler(req, res).catch(next);
}

function badRequest(message: string): Error {
  const error: any = new Error(message);
  error.status = 400;
  return error;
}

function requireFields(body: any, fields: string[]): void {
  const missing = fields.filter(
    (field) => body?.[field] === undefined || body?.[field] === null || body?.[field] === ""
  );

  if (missing.length > 0) {
    throw badRequest(`Missing required fields: ${missing.join(", ")}`);
  }
}

export default function createApp() {
  const app = express();
  const productFacade = ProductAdmFacadeFactory.create();
  const clientFacade = ClientAdmFacadeFactory.create();
  const checkoutFacade = CheckoutFacadeFactory.create();
  const invoiceFacade = InvoiceFacadeFactory.create();

  app.use(express.json());

  app.post(
    "/products",
    asyncHandler(async (req, res) => {
      requireFields(req.body, ["name", "description", "purchasePrice", "stock"]);

      const { name, description, purchasePrice, stock } = req.body;
      if (typeof purchasePrice !== "number" || typeof stock !== "number") {
        throw badRequest("purchasePrice and stock must be numbers");
      }

      const id = req.body.id ?? new Id().id;
      const salesPrice = req.body.salesPrice ?? purchasePrice;

      await productFacade.addProduct({
        id,
        name,
        description,
        purchasePrice,
        stock,
        salesPrice,
      });

      res.status(201).json({ id, name, description, purchasePrice, stock, salesPrice });
    })
  );

  app.post(
    "/clients",
    asyncHandler(async (req, res) => {
      requireFields(req.body, ["name", "email", "document", "address"]);

      const { name, email, document, address } = req.body;
      requireFields(address, [
        "street",
        "number",
        "complement",
        "city",
        "state",
        "zipCode",
      ]);

      const id = req.body.id ?? new Id().id;

      await clientFacade.add({
        id,
        name,
        email,
        document,
        address: new Address(
          address.street,
          address.number,
          address.complement,
          address.city,
          address.state,
          address.zipCode
        ),
      });

      res.status(201).json({ id, name, email, document, address });
    })
  );

  app.post(
    "/checkout",
    asyncHandler(async (req, res) => {
      requireFields(req.body, ["clientId", "products"]);

      const result = await checkoutFacade.placeOrder({
        clientId: req.body.clientId,
        products: req.body.products,
      });

      res.status(201).json(result);
    })
  );

  app.get(
    "/invoice/:id",
    asyncHandler(async (req, res) => {
      const invoice = await invoiceFacade.find({ id: req.params.id });

      res.status(200).json(invoice);
    })
  );

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status ?? (/not found/i.test(err.message ?? "") ? 404 : 400);

    res.status(status).json({ error: err.message });
  });

  return app;
}
