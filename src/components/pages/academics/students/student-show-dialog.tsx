"use client";

import { DynamicDialog } from "@/components/shared/dynamic-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { GridAvatarItem } from "@/components/ui/grid-avatar-item";
import { GridContainer } from "@/components/ui/grid-container";
import { GridItem } from "@/components/ui/grid-item";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { studentService } from "@/lib/services/academics/student.service";
import { Student } from "@/types/academics/student";
import { ShowDialogProps } from "@/types/common";
import {
	Cake,
	CheckCheck,
	Copy,
	GraduationCap,
	Info,
	MapPin,
	UserCircle2,
	UserSquare2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "../../page-header";
import { getGenderTypeLabel } from "@/config/enums/gender.type.enum";
import { getReligionLabel } from "@/config/enums/religion.type";
import { calculateAge, formatDate } from "@/lib/utils/date";
import { getStatusRegistrationLabel } from "@/config/enums/status.registration.enum";
import {
	getStatusBadgeVariant,
	getStatusLabel,
} from "@/config/enums/status.enum";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddressType } from "@/config/enums/address.type.enum";

const StudentShowDialog = ({ isOpen, onClose, uuid }: ShowDialogProps) => {
	const t = useTranslations();
	const [student, setStudent] = useState<Student | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const [copyDomicileIcon, setCopyDomicileIcon] = useState(false);
	const [copyIdCardIcon, setCopyIdCardIcon] = useState(false);

	const copyToClipboard = (
		text: string,
		type: AddressType.Domicile | AddressType.IdCard
	) => {
		navigator.clipboard.writeText(text).then(() => {
			toast.success("Alamat berhasil disalin");
			if (type === AddressType.Domicile) {
				setCopyDomicileIcon(true);
				setTimeout(() => setCopyDomicileIcon(false), 2000);
			} else {
				setCopyIdCardIcon(true);
				setTimeout(() => setCopyIdCardIcon(false), 2000);
			}
		});
	};

	useEffect(() => {
		if (isOpen && uuid) {
			setIsLoading(true);
			studentService
				.showStudent(uuid)
				.then((response) => {
					setStudent(response.data);
				})
				.catch((error) => {
					toast.error(
						error instanceof Error
							? error.message
							: "Failed to load village data"
					);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	}, [isOpen, uuid]);

	return (
		<DynamicDialog
			icon={<Info />}
			isOpen={isOpen}
			onClose={onClose}
			title={t("navigation.menu.settings.users.show")}
			description={t("navigation.description.show", {
				page: t("navigation.menu.settings.users.label"),
			})}
		>
			{isLoading ? (
				<LoadingSpinner />
			) : student ? (
				<div className="w-full">
					<Card className="mb-3">
						<PageHeader
							title={t("steps.basic_information.title")}
							description={t("steps.basic_information.description")}
							icon={<UserCircle2 />}
						/>
						<CardContent>
							<GridContainer>
								<GridAvatarItem
									avatar={student.student_photo_url}
									fullWidth
									className="mb-2"
								/>
								<GridItem
									label={t("input.common.nik.label")}
									value={student.nik || "-"}
								/>
								<GridItem
									label={t("input.common.nim.label")}
									value={student.nim}
								/>
								<GridItem
									label={t("input.common.name.label")}
									value={student.name}
								/>
								<GridItem
									label={t("input.user.email.label")}
									value={student.email}
								/>
								<GridItem
									label={t("input.user.phone.label")}
									value={student.phone}
								/>
								<GridItem
									label={t("input.common.gender.label")}
									value={getGenderTypeLabel(student.gender, t)}
								/>
								<GridItem
									label={t("input.common.religion.label")}
									value={getReligionLabel(student.religion)}
								/>
							</GridContainer>
						</CardContent>
					</Card>
					<Card className="mb-3">
						<PageHeader
							title={t("steps.birth_status.title")}
							description={t("steps.birth_status.description")}
							icon={<Cake />}
						/>
						<CardContent>
							<GridContainer>
								<GridItem
									label={t("input.common.birth_place.label")}
									value={student.birth_place || "-"}
								/>
								<GridItem
									label={t("input.common.birth_date.label")}
									value={
										student.birth_date ? formatDate(student.birth_date) : "-"
									}
								/>
								<GridItem
									label={t("input.common.age.label")}
									value={
										student.birth_date
											? `${calculateAge(student.birth_date)} ${t(
													"input.common.year.label"
											  )}`
											: "-"
									}
								/>
							</GridContainer>
						</CardContent>
					</Card>
					<Card className="mb-3">
						<PageHeader
							title={t("steps.academic_information.title")}
							description={t("steps.academic_information.description")}
							icon={<GraduationCap />}
						/>
						<CardContent>
							<GridContainer>
								<GridItem
									label={t("input.common.initial_registration_period.label")}
									value={student.initial_registration_period || "-"}
								/>
								<GridItem
									label={t("input.common.origin_department.label")}
									value={student.origin_department || "-"}
								/>
								<GridItem
									label={t("input.common.upbjj.label")}
									value={student.upbjj || "-"}
								/>
								<GridItem
									label={t("module.academic.majors")}
									value={student.major.name || "-"}
								/>
								<GridItem
									label={t("input.common.status_registration.label")}
									value={getStatusRegistrationLabel(
										student.status_registration
									)}
								/>
								<GridItem
									label={t("input.common.status_activity.label")}
									value={
										<Badge
											variant={getStatusBadgeVariant(student.status_activity)}
										>
											{getStatusLabel(student.status_activity, t)}
										</Badge>
									}
								/>
							</GridContainer>
						</CardContent>
					</Card>
					<Card className="mb-3">
						<PageHeader
							title={t("steps.address_information.title")}
							description={t("steps.address_information.description")}
							icon={<MapPin />}
						/>
						<CardContent>
							<div className="space-y-4">
								{student.domicile_address && (
									<div className="border px-4 pb-4 pt-2 rounded-lg">
										<div className="flex justify-between items-center mb-2">
											<h6 className="font-medium">
												{t("input.location.address.type.domicile.label")}
											</h6>
											<Button
												variant="ghost"
												size="icon"
												onClick={() =>
													copyToClipboard(
														`${student.domicile_address.address}, ${student.domicile_address.village.name}, ${student.domicile_address.village.district.name}, ${student.domicile_address.village.district.regency.name}, ${student.domicile_address.village.district.regency.province.name} ${student.domicile_address.village.pos_code}`,
														AddressType.Domicile
													)
												}
											>
												{copyDomicileIcon ? (
													<CheckCheck className="h-4 w-4" />
												) : (
													<Copy className="h-4 w-4" />
												)}
											</Button>
										</div>
										<p className="text-sm">
											{student.domicile_address.address}
										</p>
										<p className="text-sm text-muted-foreground mt-1">
											{`${student.domicile_address.village.name}, ${student.domicile_address.village.district.name}, ${student.domicile_address.village.district.regency.name}, ${student.domicile_address.village.district.regency.province.name} ${student.domicile_address.village.pos_code}`}
										</p>
									</div>
								)}

								{student.id_card_address && (
									<div className="border px-4 pb-4 pt-2 rounded-lg">
										<div className="flex justify-between items-center mb-2">
											<h6 className="font-medium">
												{t("input.location.address.type.id_card.label")}
											</h6>
											<Button
												variant="ghost"
												size="icon"
												onClick={() =>
													copyToClipboard(
														`${student.id_card_address.address}, ${student.id_card_address.village.name}, ${student.id_card_address.village.district.name}, ${student.id_card_address.village.district.regency.name}, ${student.id_card_address.village.district.regency.province.name} ${student.id_card_address.village.pos_code}`,
														AddressType.IdCard
													)
												}
											>
												{copyIdCardIcon ? (
													<CheckCheck className="h-4 w-4" />
												) : (
													<Copy className="h-4 w-4" />
												)}
											</Button>
										</div>
										<p className="text-sm">{student.id_card_address.address}</p>
										<p className="text-sm text-muted-foreground mt-1">
											{`${student.id_card_address.village.name}, ${student.id_card_address.village.district.name}, ${student.id_card_address.village.district.regency.name}, ${student.id_card_address.village.district.regency.province.name} ${student.id_card_address.village.pos_code}`}
										</p>
									</div>
								)}

								{!student.domicile_address && !student.id_card_address && (
									<div className="text-sm text-muted-foreground">-</div>
								)}
							</div>
						</CardContent>
					</Card>
					<Card className="mb-3">
						<PageHeader
							title={t("steps.parent_information.title")}
							description={t("steps.parent_information.description")}
							icon={<UserSquare2 />}
						/>
						<CardContent>
							<GridContainer>
								<GridItem
									label={t("input.common.parent_name.label")}
									value={student.parent_name || "-"}
								/>
								<GridItem
									label={t("input.common.parent_phone_number.label")}
									value={student.parent_phone_number || "-"}
								/>
							</GridContainer>
						</CardContent>
					</Card>
				</div>
			) : null}
		</DynamicDialog>
	);
};

export default StudentShowDialog;
