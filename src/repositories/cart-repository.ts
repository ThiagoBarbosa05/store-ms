import type { Cart } from "../entities/cart";

export interface CartRepository {
  create(cart: Cart): Promise<void>;
  get(customerId: string): Promise<Cart | null>;
  delete(customerId: string): Promise<void>;
}
