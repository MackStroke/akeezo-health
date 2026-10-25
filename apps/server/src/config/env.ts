import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const defaultCors = [
  process.env.WEB_URL,
  "http://localhost:4000",
  "http://localhost:5173",
  "http://localhost:5174",
]
  .filter(Boolean)
  .join(",");

const EnvSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.string().default("production"),
  MONGODB_URI: z.string().default("mongodb://127.0.0.1:27017/akeezo_local"),
  PUBLIC_SITE_URL: z.string().default(process.env.WEB_URL || "http://localhost:4000"),
  CORS_ORIGINS: z.string().default(defaultCors)
});

export type Env = z.infer<typeof EnvSchema>;

export const env: Env = EnvSchema.parse(process.env);
