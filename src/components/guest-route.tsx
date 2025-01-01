"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/services/auth/auth-provider";
import { LoadingPage } from "@/components/ui/loading-page";

export function GuestRoute({ children }: { children: React.ReactNode }) {
	const { user, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && user) {
			router.replace("/");
		}
	}, [user, isLoading, router]);

	if (isLoading) {
		return <LoadingPage />;
	}

	if (user) {
		return null;
	}

	return <>{children}</>;
}
