import { GuestLayout } from "@/components/layouts/guest-layout";
import { LoginForm } from "@/components/pages/login-form";

export default function LoginPage() {
	return (
		<div className="min-h-screen bg-background">
			<GuestLayout>
				<div className="flex h-screen w-full items-center justify-center px-4">
					<LoginForm />
				</div>
			</GuestLayout>
		</div>
	);
}
