import Redis from "ioredis";
import type { Cart } from "../entities/cart";
import type { CartRepository } from "./cart-repository";
import { env } from "../env";
import { RedisCartRepositoryMapper } from "./mappers/redis-cart-repository-mapper";

export class CartRepositoryImpl implements CartRepository {
  private _client: Redis;
  private _redisKey: string;

  constructor() {
    this._client = new Redis({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      family: 0,
    });
    this._redisKey = env.REDIS_CART_PREFIX;
  }

  async create(cart: Cart): Promise<void> {
    const cartToRedis = RedisCartRepositoryMapper.toRedis(cart);
    const key = this._redisKey + cartToRedis.customerId;
    await this._client.set(key, JSON.stringify(cartToRedis));
  }
  async get(customerId: string): Promise<Cart | null> {
    const key = this._redisKey + customerId;
    const cart = await this._client.get(key);

    console.log(cart);

    if (!cart) {
      return null;
    }

    return RedisCartRepositoryMapper.fromRedis(cart);
  }

  async delete(customerId: string): Promise<void> {
    const key = this._redisKey + customerId;
    await this._client.del(key);
  }
}
