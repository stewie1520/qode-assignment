import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		NEXTAUTH_URL: z.url(),
		NEXTAUTH_SECRET: z.string().min(1),
		GOOGLE_CLIENT_ID: z.string().min(1),
		GOOGLE_CLIENT_SECRET: z.string().min(1),
		USER_SERVICE_URL: z.url(),
	},
	client: {
		NEXT_PUBLIC_SERVER_URL: z.url(),
	},
	runtimeEnv: {
		NEXTAUTH_URL: process.env.NEXTAUTH_URL,
		NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
		USER_SERVICE_URL: process.env.USER_SERVICE_URL,
		NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
	},
});
