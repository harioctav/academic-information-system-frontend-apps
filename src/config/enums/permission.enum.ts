export enum Permission {
	// General Module
	Index = "index",
	Create = "store",
	Show = "show",
	Edit = "update",
	Delete = "delete",

	// Locations Module
	ProvinceIndex = "provinces.index",
	ProvinceCreate = "provinces.store",
	ProvinceShow = "provinces.show",
	ProvinceEdit = "provinces.update",
	ProvinceDelete = "provinces.destroy",

	RegencyIndex = "regencies.index",
	RegencyCreate = "regencies.store",
	RegencyShow = "regencies.show",
	RegencyEdit = "regencies.update",
	RegencyDelete = "regencies.destroy",

	DistrictIndex = "districts.index",
	DistrictCreate = "districts.store",
	DistrictShow = "districts.show",
	DistrictEdit = "districts.update",
	DistrictDelete = "districts.destroy",

	VillageIndex = "villages.index",
	VillageCreate = "villages.store",
	VillageShow = "villages.show",
	VillageEdit = "villages.update",
	VillageDelete = "villages.destroy",

	// Academic Module
	MajorIndex = "majors.index",
	MajorCreate = "majors.store",
	MajorShow = "majors.show",
	MajorEdit = "majors.update",
	MajorDelete = "majors.destroy",

	MajorSubjectIndex = "majors.subjects.index",
	MajorSubjectCreate = "majors.subjects.store",
	MajorSubjectShow = "majors.subjects.show",
	MajorSubjectEdit = "majors.subjects.update",
	MajorSubjectDelete = "majors.subjects.destroy",

	StudentIndex = "students.index",
	StudentCreate = "students.store",
	StudentShow = "students.show",
	StudentEdit = "students.update",
	StudentDelete = "students.destroy",

	SubjectIndex = "subjects.index",
	SubjectCreate = "subjects.store",
	SubjectShow = "subjects.show",
	SubjectEdit = "subjects.update",
	SubjectDelete = "subjects.destroy",

	// Settings Module
	RoleIndex = "roles.index",
	RoleCreate = "roles.store",
	RoleShow = "roles.show",
	RoleEdit = "roles.update",
	RoleDelete = "roles.destroy",

	UserIndex = "users.index",
	UserCreate = "users.store",
	UserShow = "users.show",
	UserProfile = "users.profile",
	UserPassword = "users.password",
	UserEdit = "users.update",
	UserDelete = "users.destroy",

	// Evaluations Module
	GradeIndex = "grades.index",
	GradeCreate = "grades.store",
	GradeShow = "grades.show",
	GradeEdit = "grades.update",
	GradeDelete = "grades.destroy",

	RecommendationIndex = "recommendations.index",
	RecommendationCreate = "recommendations.store",
	RecommendationShow = "recommendations.show",
	RecommendationEdit = "recommendations.update",
	RecommendationDelete = "recommendations.destroy",
}
