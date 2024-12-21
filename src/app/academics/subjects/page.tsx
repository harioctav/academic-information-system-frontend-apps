"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import SubjectFormDialog from "@/components/pages/academics/subjects/subject-form-dialog";
import SubjectShowDialog from "@/components/pages/academics/subjects/subject-show-dialog";
import { PageHeader } from "@/components/pages/page-header";
import { DataTable } from "@/components/tables/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Permission } from "@/config/enums/permission.enum";
import { useSubjectColumns } from "@/hooks/columns/academics/use-subject-column";
import { usePermissions } from "@/hooks/permissions/use-permission";
import { useDataTable } from "@/hooks/use-datatable";
import { subjectService } from "@/lib/services/academics/subject.service";
import { Subject } from "@/types/academics/subject";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export default function HomePage() {
	const t = useTranslations();
	const { hasPermission } = usePermissions();

	// Dialog Setup
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedUuid, setSelectedUuid] = useState<string | undefined>();

	const [isShowDialogOpen, setIsShowDialogOpen] = useState(false);

	// DataTable setup
	const {
		data,
		pageCount,
		pagination,
		sorting,
		searchQuery,
		setPagination,
		setSorting,
		setSearchQuery,
		fetchData,
		isLoading,
	} = useDataTable<Subject>(subjectService.getSubjects);

	const handleCreate = () => {
		setSelectedUuid(undefined);
		setIsDialogOpen(true);
	};

	const handleEdit = (uuid: string) => {
		setSelectedUuid(uuid);
		setIsDialogOpen(true);
	};

	const handleShow = (uuid: string) => {
		setSelectedUuid(uuid);
		setIsShowDialogOpen(true);
	};

	const handleBulkDelete = async (selectedIds: string[]) => {
		try {
			const response = await subjectService.bulkDeleteSubjects(selectedIds);
			toast.success(response.message);
			await fetchData();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "An error occurred");
		}
	};

	const createColumns = useSubjectColumns();

	const columns = createColumns(
		fetchData,
		handleEdit,
		handleShow
	) as ColumnDef<Subject>[];

	return (
		<MainLayout>
			<div className="container mx-auto overflow-x-hidden">
				<Card>
					<PageHeader
						title={t("navigation.menu.academics.subjects.label")}
						description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti, iusto?"
						action={{
							type: "create",
							onClick: handleCreate,
							permission: Permission.SubjectCreate,
						}}
					/>
					<CardContent>
						<div className="relative p-1 mt-0">
							<DataTable<Subject>
								columns={columns}
								data={data}
								pageCount={pageCount}
								pagination={pagination}
								sorting={sorting}
								searchQuery={searchQuery}
								onPaginationChange={(pageIndex, pageSize) =>
									setPagination({ pageIndex, pageSize })
								}
								onSortingChange={(newSorting) => setSorting(newSorting)}
								onSearchChange={(query) => {
									setSearchQuery(query);
									setPagination({ ...pagination, pageIndex: 0 });
								}}
								showSelection={hasPermission(Permission.SubjectDelete)}
								onBulkDelete={
									hasPermission(Permission.SubjectDelete)
										? handleBulkDelete
										: undefined
								}
								isLoading={isLoading}
								actionPermissions={{
									edit: Permission.SubjectEdit,
									delete: Permission.SubjectDelete,
								}}
							/>
						</div>
					</CardContent>
				</Card>
			</div>

			<SubjectFormDialog
				isOpen={isDialogOpen}
				onClose={() => {
					setIsDialogOpen(false);
					setSelectedUuid(undefined);
				}}
				uuid={selectedUuid}
				onSuccess={fetchData}
			/>

			<SubjectShowDialog
				isOpen={isShowDialogOpen}
				onClose={() => {
					setIsShowDialogOpen(false);
					setSelectedUuid(undefined);
				}}
				uuid={selectedUuid}
			/>
		</MainLayout>
	);
}
