import { Card } from "antd";

export default function Page() {
	return (
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden">
			<div className="relative z-10 w-full max-w-md px-6">
				<Card>
					<div className="mb-8 text-center">
						<div className="mb-4 flex animate-bounce-in flex-col items-center justify-center rounded-2xl">
							<h1 className="mb-2 font-bold text-3xl text-red-600">Error</h1>
							<p className="text-gray-600 text-sm">
								An error occurred while signing in
							</p>
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
}
