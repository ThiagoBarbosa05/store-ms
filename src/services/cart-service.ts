import { Cart, type CartItem } from "../entities/cart";
import { ResourceNotFoundError } from "../errors/resource-not-found";
import type { CartRepository } from "../repositories/cart-repository";

export class CartService {
  constructor(private cartRepository: CartRepository) {}

  async createCart(item: CartItem, customerId: string): Promise<void> {
    const cartExists = await this.cartRepository.get(customerId);

    if (cartExists) {
      cartExists.addItem(item);
      this.cartRepository.create(cartExists);
      return;
    }

    const items = [];
    items.push(item);

    const cart = Cart.create({
      customerId,
      items,
    });

    this.cartRepository.create(cart);
  }

  async getCart(customerId: string): Promise<Cart> {
    const cart = await this.cartRepository.get(customerId);

    if (!cart) {
      throw new ResourceNotFoundError("Cart not found");
    }

    return cart;
  }

  async addItemToCart(item: CartItem, customerId: string): Promise<void> {
    const cart = await this.cartRepository.get(customerId);

    if (!cart) {
      throw new ResourceNotFoundError("Cart not found");
    }

    const cartEntity = Cart.create({
      customerId: cart.customerId,
      items: cart.items,
      total: cart.total,
      totalItems: cart.totalItems,
    });

    cartEntity.addItem(item);

    await this.cartRepository.create(cartEntity);
  }

  async updateItemQuantity(
    itemId: string,
    quantity: number,
    customerId: string
  ): Promise<void> {
    const cart = await this.cartRepository.get(customerId);

    if (!cart) {
      throw new ResourceNotFoundError("Cart not found");
    }

    const cartEntity = Cart.create({
      customerId: cart.customerId,
      items: cart.items,
      total: cart.total,
      totalItems: cart.totalItems,
    });

    cartEntity.updateItemQuantity(itemId, quantity);

    this.cartRepository.create(cartEntity);
  }

  async deleteItem(itemId: string, customerId: string) {
    const cart = await this.cartRepository.get(customerId);

    if (!cart) {
      throw new ResourceNotFoundError("Cart not found");
    }

    const cartEntity = Cart.create({
      customerId: cart.customerId,
      items: cart.items,
      total: cart.total,
      totalItems: cart.totalItems,
    });

    cartEntity.removeItem(itemId);

    await this.cartRepository.create(cartEntity);
  }

  async deleteCart(customerId: string) {
    await this.cartRepository.delete(customerId);
  }
}
