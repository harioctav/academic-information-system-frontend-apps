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

export const getRoleOptions = () => {
	return Object.entries(UserRoleLabel).map(([value, label]) => ({
		value,
		label,
	}));
};

export const getRoleLabel = (value: string): string => {
	return UserRoleLabel[value as UserRole] || value;
};
