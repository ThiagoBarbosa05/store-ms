import mongoose, { type Model, Schema, type Document } from "mongoose";

const { ObjectId } = mongoose.Schema;

interface Item {
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  productId: string;
}

interface Order extends Document {
  customerId: string;
  customer: string;
  items: Item[];
  amount: number;
  totalItems: number;
  createdAt: Date;
  addressId: typeof ObjectId;
}

const itemSchema = new Schema<Item>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  quantity: { type: Number, required: true },
  productId: { type: String, required: true },
});

export const orderSchema = new Schema<Order>(
  {
    customerId: { type: String, required: true },
    customer: { type: String, required: true },
    items: { type: [itemSchema], required: true },
    amount: { type: Number, required: true },
    totalItems: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    addressId: { type: ObjectId, ref: "addresses", require: true },
  },
  { timestamps: true }
);

export const Order: Model<Order> =
  mongoose.models.Order || mongoose.model<Order>("Order", orderSchema);
