import type { CartItem } from "./cart";

interface OrderWithAddressProps {
  orderId: string;
  customerId: string;
  customerName: string;
  items: CartItem[];
  amount: number;
  totalItems: number;
  createdAt: string;
  address: {
    street: string;
    number: string;
    city: string;
    state: string;
    zipCode: string;
    neighborhood: string;
  };
}

export class OrderWithAddress {
  private _props: OrderWithAddressProps;

  constructor(props: OrderWithAddressProps) {
    this._props = props;
  }

  public get orderId(): string {
    return this._props.orderId;
  }

  public get customerId(): string {
    return this._props.customerId;
  }

  public get customerName(): string {
    return this._props.customerName;
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

  public get createdAt(): string {
    return this._props.createdAt;
  }

  public get address() {
    return this._props.address;
  }

  static create(props: OrderWithAddress) {
    return new OrderWithAddress(props);
  }
}
