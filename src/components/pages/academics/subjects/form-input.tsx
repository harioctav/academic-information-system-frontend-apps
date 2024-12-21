import { DynamicInput } from "@/components/forms/dynamic-input";
import { CheckboxGroup } from "@/components/ui/checkbox-group";
import { DynamicSelect } from "@/components/ui/dynamic-select";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { SubjectNote } from "@/config/enums/subject.note.enum";
import { getSubjectStatusOptions } from "@/config/enums/subject.status.enum";
import { subjectService } from "@/lib/services/academics/subject.service";
import { SubjectRequest } from "@/types/academics/subject";
import { ApiError, ValidationErrors } from "@/types/api";
import { FormProps } from "@/types/common";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const SubjectFormInput = ({ uuid, isEdit, onSuccess }: FormProps) => {
	const router = useRouter();
	const t = useTranslations();

	// Setup Form Request
	const [code, setCode] = useState("");
	const [name, setName] = useState("");
	const [courseCredit, setCourseCredit] = useState("");
	const [subjectStatus, setSubjectStatus] = useState("");
	const [examTime, setExamTime] = useState("");
	const [notes, setNotes] = useState<string[]>([]);

	const [errors, setErrors] = useState<ValidationErrors>({});
	const [isLoading, setIsLoading] = useState(false);

	const LoadSubjectData = useCallback(async () => {
		if (!uuid) return;

		try {
			const response = await subjectService.showSubject(uuid);
			setCode(response.data.code);
			setName(response.data.name);
			setCourseCredit(response.data.course_credit);
			setSubjectStatus(response.data.subject_status);
			setExamTime(response.data.exam_time);

			// Convert pipe-separated string to array and trim whitespace
			const notesArray = response.data.subject_note
				? response.data.subject_note.split("|").map((note) => note.trim())
				: [];
			setNotes(notesArray);
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to load major data"
			);
		}
	}, [uuid]);

	useEffect(() => {
		if (isEdit && uuid) {
			LoadSubjectData();
		}
	}, [isEdit, uuid, LoadSubjectData]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setErrors({});

		const request: SubjectRequest = {
			code: code,
			name: name,
			course_credit: courseCredit,
			subject_status: subjectStatus,
			exam_time: examTime,
			notes: notes,
		};

		try {
			if (isEdit && uuid) {
				const response = await subjectService.updateSubject(uuid, request);
				toast.success(response.message);
			} else {
				const response = await subjectService.storeSubject(request);
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
				apiError.message || "An error occurred while saving the Subject"
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full max-w-md mx-auto py-3">
			<form onSubmit={handleSubmit}>
				<div className="grid gap-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<DynamicInput
							type="text"
							name="code"
							label={t("input.common.code.label")}
							value={code}
							onChange={setCode}
							error={errors.code?.[0]}
							disabled={isLoading}
						/>

						<DynamicInput
							type="text"
							name="name"
							label={t("input.common.name.label")}
							value={name}
							onChange={setName}
							error={errors.name?.[0]}
							disabled={isLoading}
						/>
					</div>

					<DynamicInput
						type="number"
						name="course_credit"
						label={t("input.common.course_credit.label")}
						value={courseCredit}
						onChange={setCourseCredit}
						error={errors.course_credit?.[0]}
						disabled={isLoading}
						min={1}
						max={4}
					/>

					<div className="space-y-2">
						<Label
							htmlFor="subject_status"
							className="block text-sm font-medium mb-2"
						>
							{t("input.common.subject_status.label")}
						</Label>
						<DynamicSelect
							value={subjectStatus}
							onChange={(value) => setSubjectStatus(value || "")}
							options={getSubjectStatusOptions()}
							placeholder={t("input.select")}
						/>
						{errors.subject_status && (
							<span className="text-sm text-red-500">
								{errors.subject_status}
							</span>
						)}
					</div>

					<DynamicInput
						type="number"
						name="exam_time"
						label={t("input.common.exam_time.label")}
						value={examTime}
						onChange={setExamTime}
						error={errors.exam_time?.[0]}
						disabled={isLoading}
						min={0}
						step={0.1}
					/>

					<CheckboxGroup
						label={t("input.common.subject_note.label")}
						options={SubjectNote}
						value={notes}
						onChange={setNotes}
						disabled={isLoading}
					/>

					<SubmitButton type="submit" className="w-full" isLoading={isLoading}>
						{isEdit ? t("button.common.edit") : t("button.common.create")}
					</SubmitButton>
				</div>
			</form>
		</div>
	);
};

export default SubjectFormInput;
