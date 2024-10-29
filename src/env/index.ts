import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().default("mongodb://localhost:27017/orders"),
  JWT_PUBLIC_KEY: z.string(),
  REDIS_CART_PREFIX: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
  KAFKA_CLIENT_ID: z.string(),
  KAFKA_BROKER: z.string(),
});

export const env = envSchema.parse(process.env);
