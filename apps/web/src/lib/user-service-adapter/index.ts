import type { Adapter, AdapterAccount, AdapterUser } from "next-auth/adapters";
import { env } from "@/env";

export function userServiceAdapter(): Adapter {
	const baseUrl = env.USER_SERVICE_URL;

	return {
		async createUser(user: Omit<AdapterUser, "id">) {
			const res = await fetch(`${baseUrl}/auth/create-user`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(user),
			});
			if (!res.ok) {
				throw new Error("Failed to create user");
			}
			return res.json();
		},

		async getUser(id: string) {
			const res = await fetch(`${baseUrl}/auth/get-user?id=${id}`);
			if (res.status === 404) return null;
			if (!res.ok) throw new Error("Failed to get user");
			return res.json();
		},

		async getUserByEmail(email: string) {
			const res = await fetch(
				`${baseUrl}/auth/get-user-by-email?email=${email}`,
			);
			if (res.status === 404) return null;
			if (!res.ok) throw new Error("Failed to get user by email");
			return res.json();
		},

		async getUserByAccount({
			provider,
			providerAccountId,
		}: Pick<AdapterAccount, "provider" | "providerAccountId">) {
			const res = await fetch(
				`${baseUrl}/auth/get-user-by-account?provider=${provider}&providerAccountId=${providerAccountId}`,
			);
			if (res.status === 404) return null;
			if (!res.ok) throw new Error("Failed to get user by account");
			return res.json();
		},

		async linkAccount(account: AdapterAccount) {
			const res = await fetch(`${baseUrl}/auth/link-account`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(account),
			});
			if (!res.ok) throw new Error("Failed to link account");
			return res.json();
		},
	};
}
