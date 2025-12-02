import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Header from "@/components/header";

export default async function AuthenticatedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession();
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
