import { BaseService } from "@/lib/base.service";
import { Student, StudentRequest } from "@/types/academics/student";
import { Params } from "@/types/api";

class StudentService extends BaseService {
	constructor() {
		super("/academics/students");
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @param params
	 * @returns
	 */
	getStudents = (params: Params) => {
		return this.get<Student[]>("", params);
	};

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param request
	 * @returns
	 */
	storeStudent = (request: StudentRequest) => {
		const formData = new FormData();

		// Map basic required fields
		const requiredFields = {
			nim: request.nim,
			name: request.name,
			gender: request.gender,
			religion: request.religion,
			phone: request.phone,
			major: request.major.toString(),
		};
		Object.entries(requiredFields).forEach(([key, value]) =>
			formData.append(key, value)
		);

		// Map optional fields
		const optionalFields = {
			nik: request.nik,
			email: request.email,
			birth_place: request.birth_place,
			birth_date: request.birth_date,
			status_registration: request.status_registration,
			status_activity: request.status_activity?.toString(),
			initial_registration_period: request.initial_registration_period,
			origin_department: request.origin_department,
			upbjj: request.upbjj,
			parent_name: request.parent_name,
			parent_phone_number: request.parent_phone_number,
		};
		Object.entries(optionalFields).forEach(([key, value]) => {
			if (value) formData.append(key, value);
		});

		// Handle addresses
		request.addresses.forEach((address, index) => {
			Object.entries(address).forEach(([key, value]) => {
				formData.append(`addresses[${index}][${key}]`, value.toString());
			});
		});

		// Handle file upload
		if (request.student_photo_path) {
			formData.append("student_photo_path", request.student_photo_path);
		}

		return this.post<FormData, Student>("", formData);
	};

	/**
	 * Display the specified resource.
	 *
	 * @param uuid
	 * @returns
	 */
	showStudent = (uuid: string) => {
		return this.get<Student>(`/${uuid}`);
	};

	/**
	 * Update the specified resource in storage.
	 *
	 * @param uuid
	 * @param request
	 * @returns
	 */
	updateStudent = (uuid: string, request: StudentRequest) => {
		const formData = new FormData();

		// Map basic required fields
		const requiredFields = {
			nim: request.nim,
			name: request.name,
			gender: request.gender,
			religion: request.religion,
			phone: request.phone,
			major: request.major.toString(),
		};
		Object.entries(requiredFields).forEach(([key, value]) =>
			formData.append(key, value)
		);

		// Map optional fields
		const optionalFields = {
			nik: request.nik,
			email: request.email,
			birth_place: request.birth_place,
			birth_date: request.birth_date,
			status_registration: request.status_registration,
			status_activity: request.status_activity?.toString(),
			initial_registration_period: request.initial_registration_period,
			origin_department: request.origin_department,
			upbjj: request.upbjj,
			parent_name: request.parent_name,
			parent_phone_number: request.parent_phone_number,
		};
		Object.entries(optionalFields).forEach(([key, value]) => {
			if (value) formData.append(key, value);
		});

		// Handle addresses
		request.addresses.forEach((address, index) => {
			Object.entries(address).forEach(([key, value]) => {
				formData.append(`addresses[${index}][${key}]`, value.toString());
			});
		});

		// Handle file upload
		if (request.student_photo_path) {
			formData.append("student_photo_path", request.student_photo_path);
		}

		// Add _method field for Laravel to handle PUT request
		formData.append("_method", "PATCH");

		return this.post<FormData, Student>(`/${uuid}`, formData);
	};

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param uuid
	 * @returns
	 */
	deleteStudent = (uuid: string) => {
		return this.delete<void, Student>(`/${uuid}`);
	};

	/**
	 * Remove multiple resources from storage.
	 *
	 * @param ids
	 * @returns
	 */
	bulkDeleteStudents = (ids: string[]) => {
		return this.delete<{ ids: string[] }, Student>("/bulk-delete", { ids });
	};
}

export const studentService = new StudentService();
