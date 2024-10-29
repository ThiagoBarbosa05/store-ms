import type { Cart } from "../entities/cart";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class CartPresenter {
  static toHTTP(cart: Cart) {
    return {
      items: cart.items.map((item) => ({
        ...item,
        price: item.price / 100,
      })),
      customerId: cart.customerId,
      total: cart.total / 100,
      totalItems: cart.totalItems,
    };
  }
}
