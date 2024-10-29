import type { Optional } from "../types/optional";
import type { CartItem } from "./cart";

export interface OrderProps {
  customerId: string;
  customer: string;
  items: CartItem[];
  amount: number;
  totalItems: number;
  addressId: string;
}

export class Order {
  private _props: OrderProps;

  constructor(props: OrderProps) {
    this._props = props;
  }

  public get customerId(): string {
    return this._props.customerId;
  }

  public get customer(): string {
    return this._props.customer;
  }

  public get items(): CartItem[] {
    return this._props.items;
  }

  public get amount(): number {
    return this._props.amount;
  }

  public get totalItems(): number {
    return this._props.totalItems;
  }

  public get addressId(): string {
    return this._props.addressId;
  }

  static create(props: OrderProps) {
    return new Order(props);
  }
}
