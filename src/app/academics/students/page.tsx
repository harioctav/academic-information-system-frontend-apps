"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import StudentShowDialog from "@/components/pages/academics/students/student-show-dialog";
import { PageHeader } from "@/components/pages/page-header";
import { DataTable } from "@/components/tables/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Permission } from "@/config/enums/permission.enum";
import { useStudentColumns } from "@/hooks/columns/academics/use-student-column";
import { usePermissions } from "@/hooks/permissions/use-permission";
import { useDataTable } from "@/hooks/use-datatable";
import { studentService } from "@/lib/services/academics/student.service";
import { Student } from "@/types/academics/student";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export default function StudentPage() {
	const t = useTranslations();

	const { hasPermission } = usePermissions();
	const createColumns = useStudentColumns();

	/** Dialog show */
	const [isShowDialogOpen, setIsShowDialogOpen] = useState(false);

	/** Get uuid when action button on click */
	const [selectedUuid, setSelectedUuid] = useState<string | undefined>();

	/** Setup Datatable */
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
	} = useDataTable<Student>(studentService.getStudents);

	const handleShow = (uuid: string) => {
		setSelectedUuid(uuid);
		setIsShowDialogOpen(true);
	};

	const columns = createColumns(fetchData, handleShow) as ColumnDef<Student>[];

	/**
	 * Handle to multiple delete students
	 *
	 * @param selectedIds
	 */
	const handleBulkDelete = async (selectedIds: string[]) => {
		try {
			const response = await studentService.bulkDeleteStudents(selectedIds);
			toast.success(response.message);
			fetchData();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "An error occurred");
		}
	};

	return (
		<MainLayout>
			<div className="container mx-auto overflow-x-hidden">
				<Card>
					<PageHeader
						title={t("navigation.menu.academics.students.label")}
						description={t("navigation.description.index", {
							page: t("navigation.menu.academics.students.label"),
						})}
						action={{
							type: "create",
							url: "/academics/students/create",
							permission: Permission.StudentCreate,
						}}
					/>
					<CardContent>
						<div className="relative p-1 mt-0">
							<DataTable<Student>
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
								showSelection={hasPermission(Permission.StudentDelete)}
								onBulkDelete={
									hasPermission(Permission.StudentDelete)
										? handleBulkDelete
										: undefined
								}
								isLoading={isLoading}
								actionPermissions={{
									show: Permission.StudentShow,
									edit: Permission.StudentEdit,
									delete: Permission.StudentDelete,
								}}
							/>
						</div>
					</CardContent>
				</Card>
			</div>

			<StudentShowDialog
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
