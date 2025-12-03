import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/server/auth/auth";

export default async function SignInLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerAuthSession();
	if (session) {
		return redirect("/");
	}

	return children;
}
