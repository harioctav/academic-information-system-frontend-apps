import { GuestLayout } from "@/components/layouts/guest-layout";
import ResetPasswordForm from "@/components/pages/auth/reset-password-form";

const ResetPasswordPage = () => {
	return (
		<GuestLayout>
			<div className="flex h-screen w-full items-center justify-center px-4">
				<ResetPasswordForm />
			</div>
		</GuestLayout>
	);
};

export default ResetPasswordPage;
