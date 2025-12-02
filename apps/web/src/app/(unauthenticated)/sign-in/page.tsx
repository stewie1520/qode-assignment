"use client";

import { GoogleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
	const [isLoading, setIsLoading] = useState(false);

	const handleGoogleSignIn = async () => {
		setIsLoading(true);
		try {
			await signIn("google", { callbackUrl: "/" });
		} catch (error) {
			console.error("Sign in error:", error);
			setIsLoading(false);
		}
	};

	return (
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden">
			{/* Main content */}
			<div className="relative z-10 w-full max-w-md px-6">
				<Card>
					{/* Logo/Brand section */}
					<div className="mb-8 text-center">
						<div className="mb-4 flex animate-bounce-in flex-col items-center justify-center rounded-2xl">
							<h1 className="mb-2 font-bold text-3xl text-blue-500">
								Welcome Back
							</h1>
							<p className="text-gray-600 text-sm">
								Sign in to continue to your account
							</p>
						</div>

						{/* Sign in button */}
						<Button
							type="primary"
							onClick={handleGoogleSignIn}
							disabled={isLoading}
							className="mt-2 w-full"
							size="large"
							icon={isLoading ? <LoadingOutlined /> : <GoogleOutlined />}
						>
							{isLoading ? "Signing in..." : "Continue with Google"}
						</Button>
					</div>

					{/* Footer text */}
					<p className="mt-6 animate-fade-in text-center text-gray-600 text-sm">
						By continuing, you agree to our{" "}
						<a
							href="/terms"
							className="font-medium text-blue-500 hover:underline"
						>
							Terms of Service
						</a>{" "}
						and{" "}
						<a
							href="/privacy"
							className="font-medium text-blue-500 hover:underline"
						>
							Privacy Policy
						</a>
					</p>
				</Card>
			</div>
		</div>
	);
}
