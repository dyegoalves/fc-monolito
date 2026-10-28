import {
  PlaceOrderInputDto,
  PlaceOrderOutputDto,
} from "../usecase/place-order/place-order.dto";

export type CheckoutFacadeInputDto = PlaceOrderInputDto;
export type CheckoutFacadeOutputDto = PlaceOrderOutputDto;

export default interface CheckoutFacadeInterface {
  placeOrder(
    input: CheckoutFacadeInputDto
  ): Promise<CheckoutFacadeOutputDto>;
}
