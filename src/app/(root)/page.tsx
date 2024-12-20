import { PageHeader } from "@/components/pages/page-header";
import { StatWidget } from "@/components/shared/widgets/stat-widget";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { ShoppingBag, Users, CreditCard, Package } from "lucide-react";

export default function DashboardPage() {
	const t = useTranslations();

	return (
		<div className="container mx-auto overflow-x-hidden">
			<Card>
				<PageHeader
					title={t("pages.home")}
					description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti, iusto?"
				/>
				<CardContent>
					<div className="flex flex-1 flex-col gap-4">
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
							<StatWidget icon={ShoppingBag} value={1500} label="Sales" />
							<StatWidget icon={Users} value={2450} label="Customers" />
							<StatWidget icon={CreditCard} value="$12,500" label="Revenue" />
							<StatWidget icon={Package} value={154} label="Products" />
						</div>
						<div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50" />
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
