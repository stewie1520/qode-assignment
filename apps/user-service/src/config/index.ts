import "dotenv/config";
import z from "zod";

const configSchema = z.object({
	NODE_ENV: z.enum(["development", "production"]).default("development"),
	PORT: z.number().default(3002),
	DATABASE_URL: z.string(),
	CORS_ORIGIN: z.url(),
	INTERNAL_API_KEY: z.string(),
});

export const config = configSchema.parse(process.env);
