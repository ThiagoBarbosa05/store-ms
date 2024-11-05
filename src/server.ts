import express, { type Request, type Response } from "express";
import { authMiddleware } from "./middleware";
import { z } from "zod";
import { connectDB } from "./db/connection";
import { cartServiceFactory } from "./factories/cart-service-factory";
import { CartPresenter } from "./presenters/cart-presenter";
import { ResourceNotFoundError } from "./errors/resource-not-found";
import { addressServiceFactory } from "./factories/address-service-factory";
import { AddressPresenter } from "./presenters/address-presenter";
import { AddressRepositoryImpl } from "./repositories/address-repository-impl";
import { OrderServiceFactory } from "./factories/order-service-factory";
import { MessagingProviderImpl } from "./providers/messaging-provider-impl";
import { PubSubGcp } from "./providers/pub-sub-gcp";
import { env } from "./env";

const app = express();

app.use(express.json());

connectDB();

const cartRequestSchema = z.object({
  item: z.object({
    name: z.string(),
    price: z.number(),
    description: z.string(),
    imageUrl: z.string(),
    quantity: z.number(),
    productId: z.string(),
  }),
});
app.post("/cart", authMiddleware, async (req: Request, res: Response) => {
  const customer = req.user;

  const { item } = cartRequestSchema.parse(req.body);

  const cartService = cartServiceFactory();

  if (customer) {
    cartService.createCart(item, customer.id);
    return res.status(201).send({ message: "Success" });
  }

  return res.status(400).json({ message: "Não foi possível criar o carrinho" });
});

app.get("/cart", authMiddleware, async (req: Request, res: Response) => {
  const customer = req.user;

  if (customer) {
    try {
      const cartFactory = cartServiceFactory();

      const cart = await cartFactory.getCart(customer.id);

      return res.send(CartPresenter.toHTTP(cart));
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        return res.status(404).send({ message: err.message });
      }
    }
  }

  return res
    .status(500)
    .send({ message: "Não foi possível realizar essa operação, ver logs" });
});

const addItemToCartSchema = z.object({
  item: z.object({
    name: z.string(),
    price: z.number(),
    description: z.string(),
    imageUrl: z.string(),
    quantity: z.number(),
    productId: z.string(),
  }),
});

app.put("/cart/item", authMiddleware, async (req: Request, res: Response) => {
  const customer = req.user;

  const { item } = addItemToCartSchema.parse(req.body);

  if (customer) {
    try {
      const cartFactory = cartServiceFactory();

      await cartFactory.addItemToCart(item, customer.id);

      return res.send({ message: "Item adicionado ao carrinho" });
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        return res.status(404).send({ message: err.message });
      }
    }
  }

  return res
    .status(400)
    .send({ message: "Não foi possível adicionar item ao carrinho" });
});

app.put(
  "/cart/item/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    const { quantity } = req.body;
    const { id: itemId } = req.params;

    const customer = req.user;

    if (customer) {
      try {
        const cartFactory = cartServiceFactory();
        await cartFactory.updateItemQuantity(itemId, quantity, customer.id);

        return res
          .status(200)
          .send({ message: "Quantidade to item atualizado com sucesso" });
      } catch (err) {
        if (err instanceof ResourceNotFoundError) {
          return res.status(404).send({ message: err.message });
        }
      }
    }

    return res
      .status(500)
      .send({ message: "Não foi possível realizar essa operação" });
  }
);

app.delete(
  "/cart/item/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    const customer = req.user;
    const itemId = req.params.id;

    if (customer) {
      try {
        const cartFactory = cartServiceFactory();
        await cartFactory.deleteItem(itemId, customer.id);
        res.status(200).send({ message: "Item deletado" });
      } catch (err) {
        if (err instanceof ResourceNotFoundError) {
          return res.status(400).send({ message: err.message });
        }
      }
    }

    return res
      .status(500)
      .send({ message: "Não foi possível realizar essa operação" });
  }
);

app.delete("/cart", authMiddleware, async (req: Request, res: Response) => {
  const customer = req.user;
  if (customer) {
    const cartFactory = cartServiceFactory();
    await cartFactory.deleteCart(customer.id);
    return res.status(204).send();
  }

  return res
    .status(500)
    .send({ message: "Não foi possível realizar essa operação" });
});

//address
const addressBodySchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  neighborhood: z.string(),
  number: z.string(),
  zipCode: z.string(),
});
app.post("/address", authMiddleware, async (req: Request, res: Response) => {
  const customer = req.user;

  const { city, neighborhood, number, state, street, zipCode } =
    addressBodySchema.parse(req.body);

  if (customer) {
    const addressFactory = addressServiceFactory();

    await addressFactory.create({
      street,
      city,
      state,
      neighborhood,
      number,
      zipCode,
      customerId: customer.id,
    });

    return res.status(201).send({ message: "Endereço criado com sucesso" });
  }

  return res
    .status(500)
    .send({ message: "Não foi possível realizar essa operação" });
});

app.get("/address", authMiddleware, async (req: Request, res: Response) => {
  const customer = req.user;
  if (customer) {
    const addressFactory = addressServiceFactory();
    const addresses = await addressFactory.findAll(customer.id);
    return res.send(addresses.map(AddressPresenter.toHTTP));
  }

  return res
    .status(500)
    .send({ message: "Não foi possível realizar essa operação" });
});

app.delete(
  "/address/:addressId",
  authMiddleware,
  async (req: Request, res: Response) => {
    const customer = req.user;
    const addressId = req.params.addressId;

    if (customer) {
      const addressFactory = new AddressRepositoryImpl();
      await addressFactory.delete(addressId, customer.id);
      return res.status(204).send("ok");
    }

    return res
      .status(500)
      .send({ message: "Não foi possível realizar essa operação" });
  }
);

//orders

const orderBodySchema = z.object({
  addressId: z.string(),
});

app.post("/orders", authMiddleware, async (req: Request, res: Response) => {
  const customer = req.user;
  const { addressId } = orderBodySchema.parse(req.body);

  if (customer) {
    const cartFactory = cartServiceFactory();
    const cart = await cartFactory.getCart(customer.id);
    const orderFactory = OrderServiceFactory();
    const messaging = new PubSubGcp();

    const order = await orderFactory.createOrder({
      addressId,
      amount: cart.total,
      customer: customer.name,
      customerId: customer.id,
      items: cart.items,
      totalItems: cart.totalItems,
    });

    if (order) {
      await messaging.send(env.MESSAGING_TOPIC, [
        {
          key: order.customerId,
          value: JSON.stringify({
            orderId: order.orderId,
            customerId: order.customerId,
            customerName: order.customerName,
            items: order.items,
            amount: order.amount,
            totalItems: order.totalItems,
            createdAt: order.createdAt,
            address: order.address,
          }),
        },
      ]);
    }

    await cartFactory.deleteCart(customer.id);

    return res.status(201).send();
  }

  return res
    .status(500)
    .send({ message: "Não foi possível realizar essa operação" });
});

// app.get("/orders", authMiddleware, async (req: Request, res: Response) => {
//   const customer = req.user;

//   const orders = await Order.aggregate([
//     {
//       $match: {
//         customerId: customer?.id,
//         _id: new mongoose.Types.ObjectId("670844a7e51674a7a92d9dda"),
//       },
//     },
//     {
//       $lookup: {
//         from: "addresses",
//         localField: "addressId",
//         foreignField: "_id",
//         as: "address",
//       },
//     },
//     { $unwind: "$address" },
//   ]);

//   return res.send(orders[0]);
// });

app.listen(3000, () => {
  console.log("Microservice listening on port 3000!");
});
