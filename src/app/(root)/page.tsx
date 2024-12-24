"use client";

import { PageHeader } from "@/components/pages/page-header";
import { StatWidget } from "@/components/shared/widgets/stat-widget";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Users, BookOpen, School, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { Dashboard } from "@/types/dashboard";
import { dashboardService } from "@/lib/services/dashboard.service";
import { toast } from "sonner";

export default function DashboardPage() {
	const t = useTranslations();

	// setup data
	const [dashboard, setDashboard] = useState<Dashboard | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(true);
		dashboardService
			.dashboardData()
			.then((response) => {
				setDashboard(response.data);
			})
			.catch((error) => {
				toast.error(
					error instanceof Error
						? error.message
						: "Failed to load dashboard data"
				);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

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
							{isLoading ? (
								[...Array(4)].map((_, index) => (
									<Card
										key={index}
										className="hover:shadow-md transition-shadow duration-200"
									>
										<div className="p-6">
											<LoadingSpinner className="min-h-[80px]" />
										</div>
									</Card>
								))
							) : dashboard ? (
								<>
									<StatWidget
										icon={School}
										value={dashboard.majors}
										label={t("widget.majors.total")}
									/>
									<StatWidget
										icon={BookOpen}
										value={dashboard.subjects}
										label={t("widget.subjects.total")}
									/>
									<StatWidget
										icon={GraduationCap}
										value={1000}
										label={t("widget.students.total")}
									/>
									<StatWidget
										icon={Users}
										value={dashboard.users}
										label={t("widget.users.total")}
									/>
								</>
							) : null}
						</div>
						<div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50" />
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
