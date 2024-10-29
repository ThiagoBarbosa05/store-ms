import type { Order } from "../entities/order";
import type { OrderRepository } from "./order-repository";
import { Order as MongoOrder } from "../db/models/order";
import { OrderWithAddress } from "../entities/order-with-address";
import mongoose from "mongoose";

export class OrderRepositoryImpl implements OrderRepository {
  async find(
    customerId: string,
    orderId: string
  ): Promise<OrderWithAddress | null> {
    const order = await MongoOrder.aggregate([
      {
        $match: {
          customerId,
          _id: new mongoose.Types.ObjectId(orderId),
        },
      },
      {
        $lookup: {
          from: "addresses",
          localField: "addressId",
          foreignField: "_id",
          as: "address",
        },
      },
      { $unwind: "$address" },
    ]);

    return new OrderWithAddress({
      orderId: order[0]._id,
      customerName: order[0].customer,
      customerId: order[0].customerId,
      items: order[0].items,
      amount: order[0].amount,
      totalItems: order[0].totalItems,
      createdAt: order[0].createdAt.toISOString(),
      address: order[0].address,
    });
  }
  async create(order: Order): Promise<OrderWithAddress | null> {
    const orderCreated = await MongoOrder.create({
      customerId: order.customerId,
      customer: order.customer,
      items: order.items,
      amount: order.amount,
      totalItems: order.totalItems,
      addressId: order.addressId,
    });

    return await this.find(orderCreated.customerId, orderCreated._id as string);
  }
}
