interface AddressProps {
  customerId: string;
  street: string;
  city: string;
  state: string;
  neighborhood: string;
  number: string;
  zipCode: string;
}

export class Address {
  private _props: AddressProps;

  protected constructor(props: AddressProps) {
    this._props = props;
  }

  public get street(): string {
    return this._props.street;
  }

  public get city(): string {
    return this._props.city;
  }

  public get state(): string {
    return this._props.state;
  }

  public get customerId(): string {
    return this._props.customerId;
  }

  public get neighborhood(): string {
    return this._props.neighborhood;
  }

  public get number(): string {
    return this._props.number;
  }

  public get zipCode(): string {
    return this._props.zipCode;
  }

  static create(props: AddressProps) {
    return new Address(props);
  }
}
