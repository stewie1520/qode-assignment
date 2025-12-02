import db from "@/db";
import type { PrismaClient } from "@/db/prisma/generated/client";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified?: Date;
  image: string;
}

export interface AuthAccount {
  id: string;
  type: string;
  userId: string;
  provider: string;
  providerAccountId: string;

  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
}

export class AuthService {
  constructor(private readonly db: PrismaClient) {}

  async createUser(data: AuthUser) {
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

  async linkAccount(data: AuthAccount) {
    return this.db.account.create({ data });
  }
}

export const authService = new AuthService(db);
