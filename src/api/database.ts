import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../modules/client-adm/repository/client.model";
import InvoiceItemModel from "../modules/invoice/repository/invoice-item.model";
import InvoiceModel from "../modules/invoice/repository/invoice.model";
import TransactionModel from "../modules/payment/repository/transaction.model";
import { ProductModel } from "../modules/product-adm/repository/product.model";
import StoreProductModel from "../modules/store-catalog/repository/product.model";

export const models = [
  ProductModel,
  StoreProductModel,
  ClientModel,
  TransactionModel,
  InvoiceModel,
  InvoiceItemModel,
];

export default function createConnection(storage = ":memory:"): Sequelize {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage,
    logging: false,
  });

  sequelize.addModels(models);

  return sequelize;
}
