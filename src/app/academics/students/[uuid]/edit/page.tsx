"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import StudentWizardForm from "@/components/pages/academics/students/student-wizard-form";
import { PageHeader } from "@/components/pages/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { academicOptionService } from "@/lib/services/options/academic.option.service";
import { Student } from "@/types/academics/student";
import { ApiError } from "@/types/api";
import { useTranslations } from "next-intl";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

const StudentEditPage = ({ params }: { params: Promise<{ uuid: string }> }) => {
	const t = useTranslations();
	const resolvedParams = use(params);

	const [student, setStudent] = useState<Student | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchStudent = async () => {
			try {
				const response = await academicOptionService.showStudent(
					resolvedParams.uuid
				);
				setStudent(response.data);
			} catch (err) {
				const apiError = err as ApiError;
				toast.error(apiError.message || "Failed to fetch student data");
			} finally {
				setIsLoading(false);
			}
		};

		if (resolvedParams.uuid) {
			fetchStudent();
		}
	}, [resolvedParams.uuid]);

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (!student) {
		return <div>Student not found</div>;
	}

	const initialFormData = {
		nim: student.nim,
		nik: student.nik,
		name: student.name,
		email: student.email,
		birth_place: student.birth_place,
		birth_date: student.birth_date,
		gender: student.gender,
		religion: student.religion,
		status_registration: student.status_registration,
		status_activity: student.status_activity,
		phone: student.phone,
		major: student.major.id,
		initial_registration_period: student.initial_registration_period,
		origin_department: student.origin_department,
		upbjj: student.upbjj,
		addresses: [
			{
				type: student.domicile_address.type,
				province_id:
					student.domicile_address.village.district.regency.province.id,
				regency_id: student.domicile_address.village.district.regency.id,
				district_id: student.domicile_address.village.district.id,
				village_id: student.domicile_address.village.id,
				pos_code: student.domicile_address.village.pos_code,
				address: student.domicile_address.address,
			},
			{
				type: student.id_card_address.type,
				province_id:
					student.id_card_address.village.district.regency.province.id,
				regency_id: student.id_card_address.village.district.regency.id,
				district_id: student.id_card_address.village.district.id,
				village_id: student.id_card_address.village.id,
				pos_code: student.id_card_address.village.pos_code,
				address: student.id_card_address.address,
			},
		],
		parent_name: student.parent_name,
		parent_phone_number: student.parent_phone_number,
		student_photo_url: student.student_photo_url,
	};

	return (
		<MainLayout>
			<div className="container mx-auto overflow-x-hidden">
				<Card>
					<PageHeader
						title={t("navigation.menu.academics.students.edit")}
						description={t("navigation.description.edit", {
							page: t("navigation.menu.academics.students.label"),
						})}
						action={{
							type: "back",
							url: "/academics/students",
							resourceName: student.name,
						}}
					/>
					<CardContent>
						<StudentWizardForm
							uuid={resolvedParams.uuid}
							isEdit
							initialData={initialFormData}
							photoUrl={student.student_photo_url}
						/>
					</CardContent>
				</Card>
			</div>
		</MainLayout>
	);
};

export default StudentEditPage;
