import { BadgeVariant } from "@/components/ui/badge";

export enum UserRole {
	SuperAdmin = "super_admin",
	SubjectRegisTeam = "subject_regis_team",
	FinanceTeam = "finance_team",
	StudentRegisTeam = "student_regis_team",
	FilingTeam = "filing_team",
}

export const UserRoleLabel: Record<UserRole, string> = {
	[UserRole.SuperAdmin]: "Super Admin",
	[UserRole.SubjectRegisTeam]: "Tim Regis Matakuliah",
	[UserRole.FinanceTeam]: "Tim Keuangan",
	[UserRole.StudentRegisTeam]: "Tim Pendaftaran Mahasiswa Baru",
	[UserRole.FilingTeam]: "Tim Pemberkasan",
};

export const RoleBadgeVariants: Record<UserRole, BadgeVariant> = {
	[UserRole.SuperAdmin]: "red",
	[UserRole.SubjectRegisTeam]: "blue",
	[UserRole.FinanceTeam]: "green",
	[UserRole.StudentRegisTeam]: "purple",
	[UserRole.FilingTeam]: "yellow",
};

export const getRoleBadgeVariant = (roleName: string): BadgeVariant => {
	return RoleBadgeVariants[roleName as UserRole] || "gray";
};

export const getRoleOptions = () => {
	return Object.entries(UserRoleLabel).map(([value, label]) => ({
		value,
		label,
	}));
};

export const getRoleLabel = (value: string): string => {
	return UserRoleLabel[value as UserRole] || value;
};
