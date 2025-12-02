import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function SignInLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession();
	if (session) {
		return redirect("/");
	}

	return children;
}
