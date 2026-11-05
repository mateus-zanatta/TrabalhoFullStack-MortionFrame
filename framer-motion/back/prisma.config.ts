import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // process.env (em vez de env()) não trava o "prisma generate" quando a
    // variável ainda não existe - por exemplo, no 1º build na Vercel
    url: process.env["DATABASE_URL"],
  },
});
