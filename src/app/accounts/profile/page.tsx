"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import UpdateProfileForm from "@/components/pages/accounts/update-profile-form";
import { PageHeader } from "@/components/pages/page-header";
import { ProfileCard } from "@/components/shared/profile-card";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/services/auth/auth-provider";
import { UserCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProfilePage = () => {
	const t = useTranslations();
	const { user, refreshUser } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!user) {
			router.push("/auth/login");
		}
	}, [user, router]);

	if (!user) {
		return null;
	}

	return (
		<MainLayout>
			<div className="container mx-auto overflow-x-hidden">
				<Card>
					<PageHeader
						title={t("navigation.menu.accounts.profile.label")}
						description={t("navigation.menu.accounts.profile.description")}
						icon={<UserCircle />}
						action={{
							type: "back",
							url: "/",
						}}
					/>
					<CardContent>
						<div className="flex flex-col md:flex-row gap-20 w-full">
							<div className="relative w-full md:w-[360px] shrink-0">
								<ProfileCard user={user} />
							</div>
							<div className="flex-1 w-full">
								<UpdateProfileForm user={user} onSuccess={refreshUser} />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</MainLayout>
	);
};

export default ProfilePage;
