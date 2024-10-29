import { OrderRepositoryImpl } from "../repositories/order-repository-impl";
import { OrderService } from "../services/order-service";

export function OrderServiceFactory() {
  const orderRepository = new OrderRepositoryImpl();
  return new OrderService(orderRepository);
}
