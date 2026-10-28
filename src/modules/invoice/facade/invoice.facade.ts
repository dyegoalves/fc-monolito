import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import {
  GenerateInvoiceUseCaseInputDto,
  GenerateInvoiceUseCaseOutputDto,
} from "../usecase/generate-invoice/generate-invoice.dto";
import {
  FindInvoiceUseCaseInputDTO,
  FindInvoiceUseCaseOutputDTO,
} from "../usecase/find-invoice/find-invoice.dto";
import InvoiceFacadeInterface from "./invoice.facade.interface";

export interface InvoiceFacadeProps {
  generateUseCase: UseCaseInterface;
  findUseCase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  constructor(private props: InvoiceFacadeProps) {}

  generate(
    input: GenerateInvoiceUseCaseInputDto
  ): Promise<GenerateInvoiceUseCaseOutputDto> {
    return this.props.generateUseCase.execute(input);
  }

  find(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {
    return this.props.findUseCase.execute(input);
  }
}
