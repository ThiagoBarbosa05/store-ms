import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().default("mongodb://localhost:27017/orders"),
  JWT_PUBLIC_KEY: z.string(),
  REDIS_CART_PREFIX: z.string(),
  REDIS_HOST: z.string().optional(),
  REDIS_URL: z.string().optional(),
  REDIS_PORT: z.coerce.number().optional(),
  KAFKA_CLIENT_ID: z.string().optional(),
  KAFKA_BROKER: z.string().optional(),
  PUB_SUB_PRIVATE_KEY: z.string(),
  PUB_SUB_CLIENT_EMAIL: z.string(),
  PUB_SUB_PROJECT_ID: z.string(),
  MESSAGING_TOPIC: z.string(),
});

export const env = envSchema.parse(process.env);
