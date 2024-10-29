import type { Optional } from "../types/optional";

export interface CartItem {
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  quantity: number;
  productId: string;
}

export interface CartProps {
  items: CartItem[];
  customerId: string;
  total: number;
  totalItems: number;
}

export class Cart {
  private _props: CartProps;

  protected constructor(props: CartProps) {
    this._props = props;
  }

  public get items(): CartItem[] {
    return this._props.items;
  }

  public get customerId(): string {
    return this._props.customerId;
  }

  public get total(): number {
    return this._props.total;
  }

  public get totalItems(): number {
    return this._props.totalItems;
  }

  public addItem(item: CartItem) {
    const itemPriceInCents = item.price * 100;

    const existingItemIndex = this._props.items.findIndex(
      (i) => i.productId === item.productId
    );

    if (existingItemIndex > -1) {
      this._props.items[existingItemIndex].quantity += item.quantity;
      this.touch();
      return;
    }

    this._props.items.push({ ...item, price: itemPriceInCents });
    this.touch();
  }

  public updateItemQuantity(itemId: string, quantity: number) {
    const itemIndex = this._props.items.findIndex(
      (i) => i.productId === itemId
    );

    this._props.items[itemIndex].quantity = quantity;

    this.touch();
  }

  public removeItem(itemId: string) {
    const itemsFiltered = this._props.items.filter(
      (item) => item.productId !== itemId
    );
    this._props.items = itemsFiltered;
    this.touch();
  }

  private touch() {
    this._props.total = calculateTotalPrice(this._props.items);
    console.log(this._props.total);
    this._props.totalItems = getItemsQuantity(this._props.items);
  }

  static create(props: Optional<CartProps, "total" | "totalItems">) {
    const itemsPriceInCents = convertItemsPriceInCents(props.items);

    return new Cart({
      items: itemsPriceInCents,
      customerId: props.customerId,
      total: props.total ?? calculateTotalPrice(itemsPriceInCents),
      totalItems: props.totalItems ?? getItemsQuantity(itemsPriceInCents),
    });
  }
}

function convertItemsPriceInCents(arr: Array<CartItem>) {
  return arr.map((item) => {
    if (Number.isInteger(item.price)) {
      return item;
    }

    return {
      ...item,
      price: Math.round(item.price * 100),
    };
  });
}

function calculateTotalPrice(arr: Array<CartItem>) {
  return arr.reduce((total, item) => total + item.price * item.quantity, 0);
}

function getItemsQuantity(arr: Array<CartItem>) {
  return arr.reduce((quantity, item) => quantity + item.quantity, 0);
}
