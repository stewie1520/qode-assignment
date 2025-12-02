"use client";

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
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
			{/* Main content */}
			<div className="relative z-10 w-full max-w-md px-6">
				<div className="animate-fade-in-up rounded-3xl border border-gray-200/50 bg-white/80 p-8 shadow-2xl backdrop-blur-xl sm:p-12">
					{/* Logo/Brand section */}
					<div className="mb-8 text-center">
						<div className="mb-4 flex animate-bounce-in flex-col items-center justify-center rounded-2xl">
							<h1 className="mb-2 bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text font-bold text-3xl text-transparent">
								Welcome Back
							</h1>
							<p className="text-gray-600 text-sm">
								Sign in to continue to your account
							</p>
						</div>

						{/* Sign in button */}
						<button
							type="button"
							onClick={handleGoogleSignIn}
							disabled={isLoading}
							className="group hover:-translate-y-0.5 relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl border-2 border-gray-300 bg-white px-6 py-4 font-semibold text-gray-700 transition-all duration-300 hover:border-indigo-500 hover:shadow-indigo-500/20 hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
						>
							<div className="absolute inset-0 bg-linear-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 transition-all duration-300 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5" />

							{isLoading ? (
								<>
									<div className="relative h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
									<span className="relative">Signing in...</span>
								</>
							) : (
								<>
									<svg className="relative h-5 w-5" viewBox="0 0 24 24">
										<title>Google</title>
										<path
											fill="#4285F4"
											d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
										/>
										<path
											fill="#34A853"
											d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
										/>
										<path
											fill="#FBBC05"
											d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
										/>
										<path
											fill="#EA4335"
											d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
										/>
									</svg>
									<span className="relative">Continue with Google</span>
								</>
							)}
						</button>

						{/* Divider */}
						<div className="relative my-8">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-gray-300 border-t" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="bg-white/80 px-4 text-gray-500">
									Secure authentication
								</span>
							</div>
						</div>
					</div>

					{/* Footer text */}
					<p className="mt-6 animate-fade-in text-center text-gray-600 text-sm">
						By continuing, you agree to our{" "}
						<a
							href="/terms"
							className="font-medium text-indigo-600 hover:underline"
						>
							Terms of Service
						</a>{" "}
						and{" "}
						<a
							href="/privacy"
							className="font-medium text-indigo-600 hover:underline"
						>
							Privacy Policy
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
