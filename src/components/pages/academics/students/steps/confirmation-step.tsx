import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { GridContainer } from "@/components/ui/grid-container";
import { GridItem } from "@/components/ui/grid-item";
import { getGenderTypeLabel } from "@/config/enums/gender.type.enum";
import { getReligionLabel } from "@/config/enums/religion.type";
import { getStatusRegistrationLabel } from "@/config/enums/status.registration.enum";
import { getStatusLabel } from "@/config/enums/status.enum";
import { StudentRequest } from "@/types/academics/student";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { AddressType } from "@/config/enums/address.type.enum";
import { GridAvatarItem } from "@/components/ui/grid-avatar-item";

interface ConfirmationStepProps {
	formData: StudentRequest;
	photoUrl?: string | null;
}

const ConfirmationStep = ({ formData, photoUrl }: ConfirmationStepProps) => {
	const t = useTranslations();

	return (
		<div className="space-y-6">
			{/* Basic Information */}
			<Card>
				<CardHeader>
					<CardTitle>{t("steps.basic_information.title")}</CardTitle>
					<CardDescription>
						{t("steps.basic_information.description")}
					</CardDescription>
				</CardHeader>
				<CardContent className="pt-6">
					<GridContainer>
						<GridAvatarItem
							avatar={
								formData.student_photo_path
									? URL.createObjectURL(formData.student_photo_path)
									: photoUrl || null
							}
							fullWidth
							centered={true}
							className="mb-5"
						/>
						<GridItem
							label={t("input.common.nim.label")}
							value={formData.nim || "-"}
						/>
						<GridItem
							label={t("input.common.name.label")}
							value={formData.name || "-"}
						/>
						<GridItem
							label={t("input.common.gender.label")}
							value={getGenderTypeLabel(formData.gender, t)}
						/>
						<GridItem
							label={t("input.common.religion.label")}
							value={getReligionLabel(formData.religion) || "-"}
						/>
						<GridItem
							label={t("input.user.phone.label")}
							value={formData.phone || "-"}
						/>
					</GridContainer>
				</CardContent>
			</Card>

			{/* Birth Status */}
			<Card>
				<CardHeader>
					<CardTitle>{t("steps.birth_status.title")}</CardTitle>
					<CardDescription>
						{t("steps.birth_status.description")}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<GridContainer>
						<GridItem
							label={t("input.common.birth_place.label")}
							value={formData.birth_place || "-"}
						/>
						<GridItem
							label={t("input.common.birth_date.label")}
							value={
								formData.birth_date
									? format(new Date(formData.birth_date), "PPP")
									: "-"
							}
						/>
						<GridItem
							label={t("input.common.nik.label")}
							value={formData.nik || "-"}
						/>
					</GridContainer>
				</CardContent>
			</Card>

			{/* Academic Information */}
			<Card>
				<CardHeader>
					<CardTitle>{t("steps.academic_information.title")}</CardTitle>
					<CardDescription>
						{t("steps.academic_information.description")}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<GridContainer>
						<GridItem
							label={t("input.common.initial_registration_period.label")}
							value={formData.initial_registration_period || "-"}
						/>
						<GridItem
							label={t("input.common.status_registration.label")}
							value={
								<Badge variant="outline">
									{getStatusRegistrationLabel(
										formData.status_registration || ""
									) || "-"}
								</Badge>
							}
						/>
						<GridItem
							label={t("input.common.status_activity.label")}
							value={
								<Badge
									variant={
										formData.status_activity === 1 ? "green" : "destructive"
									}
								>
									{getStatusLabel(formData.status_activity || 0, t)}
								</Badge>
							}
						/>
					</GridContainer>
				</CardContent>
			</Card>

			{/* Address Information */}
			<Card>
				<CardHeader>
					<CardTitle>{t("steps.address_information.title")}</CardTitle>
					<CardDescription>
						{t("steps.address_information.description")}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{formData.addresses.length > 0 ? (
							formData.addresses.map((address, index) => (
								<div key={index} className="border p-4 rounded-lg">
									<h4 className="font-medium mb-2">
										{address.type === AddressType.Domicile
											? t("input.location.address.type.domicile.label")
											: t("input.location.address.type.id_card.label")}
									</h4>
									<p className="text-sm">{address.address || "-"}</p>
								</div>
							))
						) : (
							<div className="text-sm text-muted-foreground">-</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Parent Information */}
			<Card>
				<CardHeader>
					<CardTitle>{t("steps.parent_information.title")}</CardTitle>
					<CardDescription>
						{t("steps.parent_information.description")}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<GridContainer>
						<GridItem
							label={t("input.common.parent_name.label")}
							value={formData.parent_name || "-"}
						/>
						<GridItem
							label={t("input.common.parent_phone_number.label")}
							value={formData.parent_phone_number || "-"}
						/>
					</GridContainer>
				</CardContent>
			</Card>
		</div>
	);
};

export default ConfirmationStep;
