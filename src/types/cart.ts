import type { CartItem } from "./cart-item";

export interface CartType {
  items: CartItem[];
  customerId: string;
  total: number;
  totalItems: number;
}
