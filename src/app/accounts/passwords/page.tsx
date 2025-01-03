import { MainLayout } from "@/components/layouts/main-layout";
import { PageHeader } from "@/components/pages/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { KeyRound } from "lucide-react";
import { useTranslations } from "next-intl";

const ChangePasswordPages = () => {
	const t = useTranslations();
	return (
		<MainLayout>
			<div className="container mx-auto overflow-x-hidden">
				<Card>
					<PageHeader
						title={t("navigation.menu.accounts.passwords.label")}
						description={t("navigation.menu.accounts.passwords.description")}
						icon={<KeyRound />}
					/>
					<CardContent>
						<div className="flex flex-1 flex-col gap-4">
							<div className="grid auto-rows-min gap-4 md:grid-cols-3">
								<div className="aspect-video rounded-xl bg-muted/50" />
								<div className="aspect-video rounded-xl bg-muted/50" />
								<div className="aspect-video rounded-xl bg-muted/50" />
							</div>
							<div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
						</div>
					</CardContent>
				</Card>
			</div>
		</MainLayout>
	);
};

export default ChangePasswordPages;
