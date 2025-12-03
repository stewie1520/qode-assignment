import { NextResponse } from "next/server";
import { env } from "@/env";
import { getServerAuthSession } from "@/server/auth/auth";

export async function POST(request: Request) {
	const session = await getServerAuthSession();

	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await request.json();
		const { fileName, contentType, fileSize } = body;

		if (!fileName || !contentType || !fileSize) {
			return NextResponse.json(
				{ error: "Missing required fields: fileName, contentType, fileSize" },
				{ status: 400 },
			);
		}

		const response = await fetch(
			`${env.PHOTO_SERVICE_URL}/photos/presigned-url`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Internal-API": env.PHOTO_SERVICE_INTERNAL_API_KEY,
				},
				body: JSON.stringify({
					userId: session.user.id,
					fileName,
					contentType,
					fileSize,
				}),
			},
		);

		if (!response.ok) {
			const error = await response.json();
			return NextResponse.json(error, { status: response.status });
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error getting presigned URL:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
