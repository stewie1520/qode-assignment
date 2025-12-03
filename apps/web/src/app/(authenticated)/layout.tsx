import { redirect } from "next/navigation";
import Header from "@/components/header";
import { getServerAuthSession } from "@/server/auth/auth";

export default async function AuthenticatedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerAuthSession();
	if (!session) {
		return redirect("/sign-in");
	}

	return (
		<div>
			<Header user={session.user!} />
			{children}
		</div>
	);
}
