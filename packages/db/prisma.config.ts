import dotenv from "dotenv";
import path from "path";
import { defineConfig } from "prisma/config";

// On Vercel, env vars are injected — skip dotenv
// Locally, load from .env file
if (!process.env.VERCEL) {
  const envPath = process.env.DOTENV_CONFIG_PATH
    ? path.resolve(process.env.DOTENV_CONFIG_PATH)
    : path.resolve(__dirname, ".env");
  dotenv.config({ path: envPath });
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
