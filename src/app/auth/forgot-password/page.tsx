import { GuestLayout } from "@/components/layouts/guest-layout";
import ForgotPasswordForm from "@/components/pages/forgot-password-form";
import React from "react";

const ForgotPasswordPage = () => {
	return (
		<GuestLayout>
			<div className="flex h-screen w-full items-center justify-center px-4">
				<ForgotPasswordForm />
			</div>
		</GuestLayout>
	);
};

export default ForgotPasswordPage;
