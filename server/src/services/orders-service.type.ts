import {
  type OrderForm,
  type Order,
  type OrderStatus,
} from "../models/orders.type";

export interface OrdersService {
  createOrder(orderForm: OrderForm): Promise<Order>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<void>;
}
