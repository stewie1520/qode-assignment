import {
	type DefaultSession,
	getServerSession,
	type NextAuthOptions,
} from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import { env } from "@/env";
import { userServiceAdapter } from "./user-service-adapter";

declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
		} & DefaultSession["user"];
	}
}

declare module "next-auth/jwt" {
	interface JWT extends DefaultJWT {
		id: string;
	}
}

export const authOptions: NextAuthOptions = {
	pages: {
		signIn: "/sign-in",
		error: "/auth-error",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user && token.id) {
				session.user.id = token.id;
			}
			return session;
		},
	},
	session: {
		strategy: "jwt",
	},
	secret: env.NEXTAUTH_SECRET,
	adapter: userServiceAdapter(),
	providers: [
		GoogleProvider({
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		}),
	],
};

export const getServerAuthSession = () => getServerSession(authOptions);
