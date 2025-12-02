import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { env } from "@/env";
import { userServiceAdapter } from "@/lib/user-service-adapter";

const handler = NextAuth({
	adapter: userServiceAdapter(),
	providers: [
		GoogleProvider({
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		}),
	],
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/sign-in",
		error: "/auth-error",
	},
});

export { handler as GET, handler as POST };
