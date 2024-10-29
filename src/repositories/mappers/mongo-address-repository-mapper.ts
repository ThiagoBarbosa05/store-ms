import type { AddressDocument } from "../../db/models/address";
import { Address } from "../../entities/address";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class MongoAddressRepositoryMapper {
  static fromMongo(address: AddressDocument) {
    return Address.create({
      city: address.city,
      customerId: address.customerId,
      neighborhood: address.neighborhood,
      number: address.number,
      state: address.state,
      street: address.street,
      zipCode: address.zipCode,
    });
  }
}
