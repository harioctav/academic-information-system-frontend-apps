import { BaseService } from "@/lib/base.service";
import { TokenStorage } from "@/lib/utils/token-storage";
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
		formData.append("nim", request.nim);
		formData.append("name", request.name);
		formData.append("gender", request.gender);
		formData.append("religion", request.religion);
		formData.append("phone", request.phone);
		formData.append("major", request.major.toString());

		if (request.nik) {
			formData.append("nik", request.nik);
		}
		if (request.email) {
			formData.append("email", request.email);
		}
		if (request.birth_place) {
			formData.append("birth_place", request.birth_place);
		}
		if (request.birth_date) {
			formData.append("birth_date", request.birth_date);
		}
		if (request.status_registration) {
			formData.append("status_registration", request.status_registration);
		}
		if (request.status_activity !== undefined) {
			formData.append("status_activity", request.status_activity.toString());
		}
		if (request.initial_registration_period) {
			formData.append(
				"initial_registration_period",
				request.initial_registration_period
			);
		}
		if (request.origin_department) {
			formData.append("origin_department", request.origin_department);
		}
		if (request.upbjj) {
			formData.append("upbjj", request.upbjj);
		}
		if (request.parent_name) {
			formData.append("parent_name", request.parent_name);
		}
		if (request.parent_phone_number) {
			formData.append("parent_phone_number", request.parent_phone_number);
		}

		request.addresses.forEach((address, index) => {
			Object.entries(address).forEach(([key, value]) => {
				formData.append(`addresses[${index}][${key}]`, value.toString());
			});
		});

		if (request.student_photo_path) {
			formData.append("student_photo_path", request.student_photo_path);
		}

		return fetch(this.baseUrl, {
			method: "POST",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${TokenStorage.getAccessToken()}`,
			},
			credentials: "include",
			body: formData,
		}).then(async (response) => {
			const result = await response.json();
			if (!response.ok) throw result;
			this.clearListCache();
			return result;
		});
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
