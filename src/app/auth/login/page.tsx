import { GuestLayout } from "@/components/layouts/guest-layout";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
	return (
		<GuestLayout>
			<div className="flex h-screen w-full items-center justify-center px-4">
				<LoginForm />
			</div>
		</GuestLayout>
	);
}
