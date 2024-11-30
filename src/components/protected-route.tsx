"use client";

import { useAuth } from "@/lib/auth/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingPage } from "@/components/ui/loading-page";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { user, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !user) {
			router.replace("/auth/login");
		}
	}, [user, isLoading, router]);

	if (isLoading) {
		return <LoadingPage />;
	}

	if (!user) {
		return null;
	}

	return <>{children}</>;
}
