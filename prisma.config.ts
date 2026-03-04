import "dotenv/config";
import { defineConfig } from "prisma/config";

const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DATABASE_URL,
} = process.env;

const url =
  DATABASE_URL ??
  `postgresql://${encodeURIComponent(DB_USERNAME ?? "")}:${encodeURIComponent(DB_PASSWORD ?? "")}` +
    `@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=require`;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url },
});