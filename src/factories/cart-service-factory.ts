import { CartRepositoryImpl } from "../repositories/cart-repository-impl";
import { CartService } from "../services/cart-service";

export function cartServiceFactory() {
  const cartRepository = new CartRepositoryImpl();
  return new CartService(cartRepository);
}
