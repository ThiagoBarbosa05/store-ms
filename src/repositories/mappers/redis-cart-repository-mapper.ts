import { Cart } from "../../entities/cart";
import type { CartItem } from "../../types/cart-item";

type CartFromRedis = {
  items: CartItem[];
  customerId: string;
  total: number;
  totalItems: number;
};

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class RedisCartRepositoryMapper {
  static toRedis(cart: Cart) {
    return {
      items: cart.items,
      total: cart.total,
      totalItems: cart.totalItems,
      customerId: cart.customerId,
    };
  }

  static fromRedis(cart: string) {
    const parsedCart: CartFromRedis = JSON.parse(cart);
    return Cart.create({
      customerId: parsedCart.customerId,
      items: parsedCart.items,
      total: parsedCart.total,
      totalItems: parsedCart.totalItems,
    });
  }
}
