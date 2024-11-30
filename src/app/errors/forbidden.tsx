"use client";

import { GuestLayout } from "@/components/layouts/guest-layout";
import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";
import { useRouter } from "next/navigation";

export function ForbiddenPage() {
	const router = useRouter();

	return (
		<GuestLayout>
			<div className="flex flex-col items-center justify-center gap-4">
				<ShieldX className="h-32 w-32 text-destructive animate-pulse" />
				<h1 className="text-4xl font-bold">403 Forbidden</h1>
				<p className="text-muted-foreground">
					You don`t have permission to access this page
				</p>
				<Button onClick={() => router.push("/dashboard")}>
					Back to Dashboard
				</Button>
			</div>
		</GuestLayout>
	);
}
