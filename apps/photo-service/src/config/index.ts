import "dotenv/config";
import z from "zod";

const configSchema = z.object({
	NODE_ENV: z.enum(["development", "production"]).default("development"),
	PORT: z.number().default(3000),
	DATABASE_URL: z.string(),
	CORS_ORIGIN: z.url(),
	INTERNAL_API_KEY: z.string(),
	AWS_REGION: z.string(),
	AWS_ACCESS_KEY_ID: z.string(),
	AWS_SECRET_ACCESS_KEY: z.string(),
	AWS_S3_BUCKET: z.string(),
});

export const config = configSchema.parse(process.env);
p;
