import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import InvoiceFacadeInterface from "../../../invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

type CheckoutProduct = {
  id: string;
  name: string;
  price: number;
};

export default class PlaceOrderUseCase implements UseCaseInterface {
  constructor(
    private clientFacade: ClientAdmFacadeInterface,
    private productFacade: ProductAdmFacadeInterface,
    private catalogFacade: StoreCatalogFacadeInterface,
    private paymentFacade: PaymentFacadeInterface,
    private invoiceFacade: InvoiceFacadeInterface
  ) {}

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    if (!input.products || input.products.length === 0) {
      throw new Error("No products selected");
    }

    const client = await this.clientFacade.find({ id: input.clientId });
    const products = await this.getProducts(input);

    const invoice = await this.invoiceFacade.generate({
      name: client.name,
      document: client.document,
      street: client.address.street,
      number: client.address.number,
      complement: client.address.complement,
      city: client.address.city,
      state: client.address.state,
      zipCode: client.address.zipCode,
      items: products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
      })),
    });

    const payment = await this.paymentFacade.process({
      orderId: invoice.id,
      amount: invoice.total,
    });

    if (payment.status !== "approved") {
      throw new Error("Payment declined");
    }

    return {
      invoiceId: invoice.id,
      total: invoice.total,
      status: payment.status,
    };
  }

  private async getProducts(
    input: PlaceOrderInputDto
  ): Promise<CheckoutProduct[]> {
    const products: CheckoutProduct[] = [];

    for (const item of input.products) {
      const { stock } = await this.productFacade.checkStock({
        productId: item.productId,
      });

      if (stock <= 0) {
        throw new Error(`Product ${item.productId} is not available in stock`);
      }

      const product = await this.catalogFacade.find({ id: item.productId });
      products.push({
        id: product.id,
        name: product.name,
        price: product.salesPrice,
      });
    }

    return products;
  }
}
