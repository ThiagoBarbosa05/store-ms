import type { Order } from "../entities/order";
import type { OrderWithAddress } from "../entities/order-with-address";

export interface OrderRepository {
  create(order: Order): Promise<OrderWithAddress | null>;
  find(customerId: string, orderId: string): Promise<OrderWithAddress | null>;
}
