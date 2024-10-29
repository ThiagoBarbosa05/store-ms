import mongoose, { type Model, Schema, type Document } from "mongoose";

export interface AddressDocument extends Document {
  customerId: string;
  street: string;
  number: string;
  city: string;
  state: string;
  neighborhood: string;
  zipCode: string;
}

const addressSchema = new Schema<AddressDocument>({
  customerId: { type: String, required: true },
  street: { type: String, required: true },
  number: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  neighborhood: { type: String, required: true },
});

export const Address: Model<AddressDocument> =
  mongoose.models.Address ||
  mongoose.model<AddressDocument>("Address", addressSchema);
