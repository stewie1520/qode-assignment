import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/server/auth/auth";

export default async function Page() {
	const session = await getServerAuthSession();

	if (!session?.user) {
		return redirect("/sign-in");
	}

	return redirect("/photos");
}
