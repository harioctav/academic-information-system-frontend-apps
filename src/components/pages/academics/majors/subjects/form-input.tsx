"use client";

import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { DynamicSelect } from "@/components/forms/dynamic-select";
import { getSemesterOptions } from "@/config/enums/semester.enum";
import { majorSubjectService } from "@/lib/services/academics/major.subject.service";
import { MajorSubjectRequest } from "@/types/academics/major.subject";
import { ApiError, ValidationErrors } from "@/types/api";
import { FormProps } from "@/types/common";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Subject } from "@/types/academics/subject";
import { AsyncSelectInput, SelectOption } from "@/components/ui/async-select";
import { majorSubjectOptionService } from "@/lib/services/academics/major.subject.option.service";

interface MajorSubjectFormProps extends FormProps {
	majorUuid: string;
}

const MajorSubjectFormInput = ({
	majorUuid,
	uuid,
	isEdit,
	onSuccess,
}: MajorSubjectFormProps) => {
	const router = useRouter();
	const t = useTranslations();
	const [subjects, setSubjects] = useState<string[]>([]);
	const [semester, setSemester] = useState<number>(0);
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [isLoading, setIsLoading] = useState(false);
	const [selectedSubjects, setSelectedSubjects] = useState<
		SelectOption<Subject>[]
	>([]);

	const LoadMajorSubjectData = useCallback(async () => {
		if (!uuid || !majorUuid) return;

		try {
			const response = await majorSubjectOptionService.showMajorSubject(
				majorUuid,
				uuid
			);
			setSelectedSubjects([
				{
					value: response.data.subject.id,
					label: response.data.subject.name,
					data: response.data.subject,
				},
			]);
			setSubjects([response.data.subject.id.toString()]);
			setSemester(response.data.semester);
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to load major subject data"
			);
		}
	}, [uuid, majorUuid]);

	useEffect(() => {
		if (isEdit && uuid) {
			LoadMajorSubjectData();
		}
	}, [isEdit, uuid, LoadMajorSubjectData]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setErrors({});

		const request: MajorSubjectRequest = {
			subjects: subjects,
			semester: semester,
		};

		try {
			if (isEdit && uuid) {
				const response = await majorSubjectService.updateMajorSubject(
					majorUuid,
					uuid,
					request
				);
				toast.success(response.message);
			} else {
				const response = await majorSubjectService.storeMajorSubject(
					majorUuid,
					request
				);
				toast.success(response.message);
			}

			if (onSuccess) {
				onSuccess();
			}

			router.refresh();
		} catch (error) {
			const apiError = error as ApiError;
			if (apiError.errors) {
				setErrors(apiError.errors);
			}
			toast.error(
				apiError.message || "An error occurred while saving the Major Subject"
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full max-w-md mx-auto py-3">
			<form onSubmit={handleSubmit}>
				<div className="grid gap-6">
					<div className="space-y-2">
						<Label
							htmlFor="semester"
							className="block text-sm font-medium mb-2"
						>
							{t("input.common.semester.label")}
						</Label>
						<DynamicSelect
							value={semester.toString()}
							onChange={(value) => setSemester(Number(value))}
							options={getSemesterOptions()}
							placeholder={t("input.select")}
						/>
						{errors.semester && (
							<span className="text-sm text-red-500">{errors.semester}</span>
						)}
					</div>

					<div className="space-y-2">
						<Label
							htmlFor="subjects"
							className="block text-sm font-medium mb-2"
						>
							{t("navigation.menu.academics.subjects.label")}
						</Label>
						<AsyncSelectInput<Subject>
							isMulti={true}
							apiUrl={`${process.env.NEXT_PUBLIC_API_URL}/options/academics/majors/${majorUuid}/subjects/conditions`}
							placeholder={t("input.select")}
							value={selectedSubjects}
							onChange={(newValue) => {
								setSelectedSubjects([...newValue]);
								setSubjects(
									newValue.map((option) => option.data.id.toString())
								);
							}}
							textFormatter={(subject) => subject.name}
							valueFormatter={(subject) => subject.id}
							isDisabled={isEdit}
						/>
						{errors.subjects && (
							<span className="text-sm text-red-500">{errors.subjects}</span>
						)}
					</div>

					<SubmitButton type="submit" className="w-full" isLoading={isLoading}>
						{isEdit ? t("button.common.edit") : t("button.common.create")}
					</SubmitButton>
				</div>
			</form>
		</div>
	);
};

export default MajorSubjectFormInput;
