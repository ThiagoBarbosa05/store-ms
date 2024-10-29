import type { Address } from "../entities/address";
import type { AddressRepository } from "./address-repository";
import { Address as MongoAddress } from "../db/models/address";
import { MongoAddressRepositoryMapper } from "./mappers/mongo-address-repository-mapper";

export class AddressRepositoryImpl implements AddressRepository {
  async save(address: Address): Promise<void> {
    await MongoAddress.create({
      street: address.street,
      city: address.city,
      state: address.state,
      neighborhood: address.neighborhood,
      number: address.number,
      zipCode: address.zipCode,
      customerId: address.customerId,
    });
  }
  async findAll(customerId: string): Promise<Address[] | []> {
    const addresses = await MongoAddress.find({ customerId });

    return addresses.map((address) =>
      MongoAddressRepositoryMapper.fromMongo(address)
    );
  }

  async delete(addressId: string, customerId: string): Promise<void> {
    await MongoAddress.deleteOne({ customerId, _id: addressId });
  }
}
