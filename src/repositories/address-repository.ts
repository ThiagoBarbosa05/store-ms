import type { Address } from "../entities/address";

export interface AddressRepository {
  save(address: Address): Promise<void>;
  findAll(customerId: string): Promise<Address[] | []>;
  delete(addressId: string, customerId: string): Promise<void>;
}
