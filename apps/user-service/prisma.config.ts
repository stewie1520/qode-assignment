import path from "node:path";
import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

dotenv.config({
	path: "./.env",
});

export default defineConfig({
	schema: path.join("src", "db", "prisma", "schema"),
	migrations: {
		path: path.join("src", "db", "prisma", "migrations"),
	},
	datasource: {
		url: env("DATABASE_URL"),
	},
});
