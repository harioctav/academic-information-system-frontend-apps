"use client";

import NProgress from "nprogress";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function ProgressBar() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		NProgress.configure({
			minimum: 0.3,
			easing: "ease",
			speed: 500,
		});
	}, []);

	useEffect(() => {
		NProgress.done();
		return () => {
			NProgress.start();
		};
	}, [pathname, searchParams]);

	return null;
}
