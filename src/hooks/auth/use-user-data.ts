import { authService } from "@/lib/auth/auth.service";
import { User } from "@/types/settings/user";
import { useState, useEffect } from "react";

export function useUserData() {
	const [userData, setUserData] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await authService.checkSession();
				setUserData(response.user);
			} catch {
				setUserData(null);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserData();
	}, []);

	return { userData, isLoading };
}
