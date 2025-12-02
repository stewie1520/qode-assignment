import db from "@/db";
import type { PrismaClient } from "@/db/prisma/generated/client";

export class AuthService {
	constructor(private readonly db: PrismaClient) {}

	async createUser(data: {
		name: string;
		email: string;
		emailVerified?: Date;
		image: string;
	}) {
		return this.db.user.create({ data });
	}

	async getUser(id: string) {
		return this.db.user.findUnique({ where: { id } });
	}

	async getUserByEmail(email: string) {
		return this.db.user.findUnique({ where: { email } });
	}

	async getUserByAccount(provider: string, providerAccountId: string) {
		return this.db.account
			.findUnique({
				where: { provider_providerAccountId: { provider, providerAccountId } },
				include: { user: true },
			})
			.then((account) => account?.user ?? null);
	}

	async linkAccount(data: {
		providerAccountId: string;
		userId: string;
		provider: string;
		type: string;
		access_token?: string;
		token_type?: string;
		id_token?: string;
		refresh_token?: string;
		scope?: string;
		expires_at?: number;
		session_state?: string;
	}) {
		return this.db.account.create({ data });
	}
}

export const authService = new AuthService(db);
