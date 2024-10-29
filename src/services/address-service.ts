import { Address } from "../entities/address";
import type { AddressRepository } from "../repositories/address-repository";

interface CreateCartInput {
  street: string;
  city: string;
  state: string;
  neighborhood: string;
  number: string;
  zipCode: string;
  customerId: string;
}

export class AddressService {
  constructor(private addressRepository: AddressRepository) {}

  async create(input: CreateCartInput): Promise<void> {
    const address = Address.create({
      city: input.city,
      neighborhood: input.neighborhood,
      number: input.number,
      street: input.street,
      state: input.state,
      zipCode: input.zipCode,
      customerId: input.customerId,
    });

    await this.addressRepository.save(address);
  }

  async findAll(customerId: string): Promise<Address[] | []> {
    const addresses = await this.addressRepository.findAll(customerId);

    return addresses;
  }

  async deleteOne(addressId: string, customerId: string): Promise<void> {
    await this.addressRepository.delete(addressId, customerId);
  }
}
