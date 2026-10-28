import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import InvoiceFacadeFactory from "../../invoice/factory/invoice.facade.factory";
import PaymentFacadeFactory from "../../payment/factory/payment.facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import CheckoutFacadeInterface from "../facade/checkout.facade.interface";
import CheckoutFacade from "../facade/checkout.facade";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";

export default class CheckoutFacadeFactory {
  static create(): CheckoutFacadeInterface {
    const useCase = new PlaceOrderUseCase(
      ClientAdmFacadeFactory.create(),
      ProductAdmFacadeFactory.create(),
      StoreCatalogFacadeFactory.create(),
      PaymentFacadeFactory.create(),
      InvoiceFacadeFactory.create()
    );

    return new CheckoutFacade(useCase);
  }
}
