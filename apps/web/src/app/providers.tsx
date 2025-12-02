"use client";

import {
	isServer,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000,
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
	if (isServer) {
		return makeQueryClient();
	}

	if (!browserQueryClient) browserQueryClient = makeQueryClient();
	return browserQueryClient;
}

export default function Providers({ children }: { children: React.ReactNode }) {
	const queryClient = getQueryClient();

	return (
		<SessionProvider>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</SessionProvider>
	);
}
