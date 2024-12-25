"use client";

import { DynamicDialog } from "@/components/shared/dynamic-dialog";
import { GridContainer } from "@/components/ui/grid-container";
import { GridItem } from "@/components/ui/grid-item";
import { getSubjectStatusLabel } from "@/config/enums/subject.status.enum";
import { subjectService } from "@/lib/services/academics/subject.service";
import { Subject } from "@/types/academics/subject";
import { ShowDialogProps } from "@/types/common";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const SubjectShowDialog = ({ isOpen, onClose, uuid }: ShowDialogProps) => {
	const t = useTranslations();
	const [subject, setSubject] = useState<Subject | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (isOpen && uuid) {
			setIsLoading(true);
			subjectService
				.showSubject(uuid)
				.then((response) => {
					setSubject(response.data);
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
			isOpen={isOpen}
			onClose={onClose}
			title={t("navigation.menu.academics.subjects.show")}
			description={t("navigation.description.show", {
				page: t("navigation.menu.academics.subjects.label"),
			})}
		>
			{isLoading ? (
				<div>Loading...</div>
			) : subject ? (
				<GridContainer>
					<GridItem
						label={t("input.common.code.label")}
						value={subject.code}
						className="text-center"
						fullWidth
					/>
					<GridItem
						label={t("input.common.name.label")}
						value={subject.name}
						className="text-center"
						fullWidth
					/>
					<GridItem
						label={t("input.common.course_credit.label")}
						value={subject.course_credit}
						className="text-center"
						fullWidth
					/>
					<GridItem
						label={t("input.common.subject_status.label")}
						value={getSubjectStatusLabel(subject.subject_status)}
						className="text-center"
						fullWidth
					/>
					<GridItem
						label={t("input.common.exam_time.label")}
						value={subject.exam_time}
						className="text-center"
						fullWidth
					/>
					<GridItem
						label={t("input.common.subject_note.label")}
						value={subject.subject_note || "--"}
						className="text-center"
						fullWidth
					/>

					<GridItem
						label={t("input.meta.created_at.label")}
						value={subject.created_at.formatted}
						className="text-center"
					/>
					<GridItem
						label={t("input.meta.updated_at.label")}
						value={subject.updated_at.formatted}
						className="text-center"
					/>
				</GridContainer>
			) : null}
		</DynamicDialog>
	);
};

export default SubjectShowDialog;
