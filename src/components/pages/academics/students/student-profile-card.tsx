import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { GridContainer } from "@/components/ui/grid-container";
import { GridItem } from "@/components/ui/grid-item";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	getStatusBadgeVariant,
	getStatusLabel,
} from "@/config/enums/status.enum";
import { getStatusRegistrationLabel } from "@/config/enums/status.registration.enum";
import { Student } from "@/types/academics/student";
import { Info, UserCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { PageHeader } from "../../page-header";

interface StudentProfileCardProps {
	student: Student | null;
}

export const StudentProfileCard = ({ student }: StudentProfileCardProps) => {
	const t = useTranslations();

	return (
		<Card className="w-full max-w-md mx-auto relative">
			<div className="absolute top-4 right-4">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Info className="h-4 w-4 text-muted-foreground cursor-help" />
						</TooltipTrigger>
						<TooltipContent>
							<p>{t("message.info.student_detail")}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
			<PageHeader
				title={t("navigation.menu.academics.students.show")}
				description={t("navigation.description.show", {
					page: t("navigation.menu.academics.students.label"),
				})}
				icon={<UserCircle />}
			/>
			<CardContent>
				<GridContainer>
					<GridItem
						value={student?.name}
						label={student?.nim || "-"}
						className="text-center"
						reversed
					/>
					<GridItem
						label={t("input.common.status_activity.label")}
						value={
							student ? (
								<Badge variant={getStatusBadgeVariant(student.status_activity)}>
									{getStatusLabel(student.status_activity, t)}
								</Badge>
							) : (
								"-"
							)
						}
						className="text-center"
					/>
					<GridItem
						label={t("input.common.major_name.label")}
						value={student?.major.name}
						className="text-center"
					/>
					<GridItem
						label={t("input.common.status_registration.label")}
						value={getStatusRegistrationLabel(
							student?.status_registration ?? ""
						)}
						className="text-center"
					/>
				</GridContainer>
			</CardContent>
		</Card>
	);
};
