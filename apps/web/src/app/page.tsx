"use client";

import { useSession } from "next-auth/react";

export default function Home() {
	const { data } = useSession();

	return (
		<div className="container mx-auto max-w-3xl px-4 py-2">
			{data?.user?.name}
		</div>
	);
}
