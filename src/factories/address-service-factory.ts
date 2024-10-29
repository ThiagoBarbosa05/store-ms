import { AddressRepositoryImpl } from "../repositories/address-repository-impl";
import { AddressService } from "../services/address-service";

export function addressServiceFactory() {
  const addressRepository = new AddressRepositoryImpl();
  return new AddressService(addressRepository);
}
