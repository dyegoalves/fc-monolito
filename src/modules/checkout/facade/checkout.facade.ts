import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import CheckoutFacadeInterface, {
  CheckoutFacadeInputDto,
  CheckoutFacadeOutputDto,
} from "./checkout.facade.interface";

export default class CheckoutFacade implements CheckoutFacadeInterface {
  constructor(private placeOrderUseCase: UseCaseInterface) {}

  placeOrder(
    input: CheckoutFacadeInputDto
  ): Promise<CheckoutFacadeOutputDto> {
    return this.placeOrderUseCase.execute(input);
  }
}
