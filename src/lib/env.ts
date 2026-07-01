import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid connection URL"),
  BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
  BETTER_AUTH_URL: z.string().url("BETTER_AUTH_URL must be a valid URL"),
  NVIDIA_API_KEY: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const parsedEnv = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  NVIDIA_API_KEY: process.env.NVIDIA_API_KEY,
  NODE_ENV: process.env.NODE_ENV,
});

if (!parsedEnv.success) {
  const formattedErrors = parsedEnv.error.flatten().fieldErrors;
  console.error("Invalid environment variables:", formattedErrors);
  throw new Error(
    `Invalid environment variables: ${Object.entries(formattedErrors)
      .map(([key, value]) => `${key}: ${value?.join(", ")}`)
      .join("; ")}`
  );
}

export const env = parsedEnv.data;
