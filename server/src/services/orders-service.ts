import { v4 as uuidv4 } from "uuid";
import { type Order, type OrderForm } from "../models/orders.type";
import { type OrdersService } from "./orders-service.type";

export default class OrdersServiceImpl implements OrdersService {
  /** Map para armazenar os pedidos */
  private readonly _orders = new Map<string, Order>();

  constructor() {}

  public async createOrder(orderForm: OrderForm): Promise<Order> {
    const order: Order = {
      id: uuidv4(),
      description: orderForm.description,
      status: "CREATED",
    };

    this._orders.set(order.id, order);
    return order;
  }

  public async updateOrderStatus(
    id: string,
    status: "CREATED" | "BEING_PREPARED" | "READY" | "DELIVERED"
  ): Promise<void> {
    const order = this._orders.get(id);
    if (!order) {
      throw new Error(`id '${id}' não encontrado`);
    }

    // TODO: Implementar verificação de atualização

    order.status = status;
  }
}
