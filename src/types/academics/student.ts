import { ApiResponse, TimeFormat } from "@/types/api";
import { Major } from "@/types/academics/major";
import { StudentAddress } from "@/types/academics/student.address";

export interface Student {
	id: number;
	uuid: string;
	nim: string;
	nik: string;
	name: string;
	email: string;
	birth_date: string;
	birth_place: string;
	gender: string;
	phone: string;
	religion: string;
	initial_registration_period: string;
	origin_department: string;
	upbjj: string;
	status_registration: string;
	status_activity: number;
	student_photo_url: string | null;
	parent_name: string;
	parent_phone_number: string;
	major: Major;
	domicile_address: StudentAddress;
	id_card_address: StudentAddress;
	created_at: TimeFormat;
	updated_at: TimeFormat;
}

export interface StudentRequest {
	// Basic Information
	nim: string;
	name: string;
	email?: string;
	religion: string;
	phone: string;
	student_photo_path?: File;

	// Birth Status Infomation
	nik?: string;
	birth_place?: string;
	birth_date?: string;
	gender: string;

	// Academic Information
	major: number;
	initial_registration_period?: string;
	origin_department?: string;
	status_registration?: string;
	status_activity?: number;
	upbjj?: string;

	// Address Information
	addresses: {
		type: string;
		province_id: number;
		regency_id: number;
		district_id: number;
		village_id: number;
		pos_code: string;
		address: string;
	}[];

	// Additional Information
	parent_name?: string;
	parent_phone_number?: string;
}

export type StudentResponse = ApiResponse<Student>;
export type StudentCollectionResponse = ApiResponse<Student[]>;
