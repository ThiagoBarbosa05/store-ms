import type { Address } from "../entities/address";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class AddressPresenter {
  static toHTTP(address: Address) {
    return {
      customerId: address.customerId,
      street: address.street,
      city: address.city,
      state: address.state,
      neighborhood: address.neighborhood,
      number: address.number,
      zipCode: address.zipCode,
    };
  }
}
