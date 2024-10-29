import type { CartItem } from "../entities/cart";
import { Order } from "../entities/order";
import type { OrderWithAddress } from "../entities/order-with-address";
import type { OrderRepository } from "../repositories/order-repository";

interface CreateOrderInput {
  customerId: string;
  customer: string;
  items: CartItem[];
  amount: number;
  totalItems: number;
  addressId: string;
}

export class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  async createOrder({
    addressId,
    amount,
    customer,
    customerId,
    items,
    totalItems,
  }: CreateOrderInput): Promise<OrderWithAddress | null> {
    const order = Order.create({
      addressId,
      amount,
      customer,
      customerId,
      items,
      totalItems,
    });

    const orderCreated = await this.orderRepository.create(order);

    return orderCreated;
  }
}
