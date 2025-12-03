import { NextResponse } from "next/server";
import { env } from "@/env";
import { getServerAuthSession } from "@/server/auth/auth";

/**
 * Create a new photo record
 */
export async function POST(request: Request) {
	const session = await getServerAuthSession();

	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await request.json();
		const { comment, filePath } = body;

		if (!filePath) {
			return NextResponse.json(
				{ error: "Missing required field: filePath" },
				{ status: 400 },
			);
		}

		const response = await fetch(`${env.PHOTO_SERVICE_URL}/photos`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Internal-API": env.PHOTO_SERVICE_INTERNAL_API_KEY,
			},
			body: JSON.stringify({
				userId: session.user.id,
				comment: comment || "",
				filePath,
			}),
		});

		if (!response.ok) {
			const error = await response.json();
			return NextResponse.json(error, { status: response.status });
		}

		const data = await response.json();
		return NextResponse.json(data, { status: 201 });
	} catch (error) {
		console.error("Error creating photo:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

/**
 * Get photos of current user
 */
export async function GET(request: Request) {
	const session = await getServerAuthSession();

	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { searchParams } = new URL(request.url);
		const take = searchParams.get("take") || "10";
		const skip = searchParams.get("skip") || "0";

		const response = await fetch(
			`${env.PHOTO_SERVICE_URL}/photos/user/${session.user.id}?take=${take}&skip=${skip}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"X-Internal-API": env.PHOTO_SERVICE_INTERNAL_API_KEY,
				},
			},
		);

		if (!response.ok) {
			const error = await response.json();
			return NextResponse.json(error, { status: response.status });
		}

		const data = await response.json();
		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error("Error getting photos:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
