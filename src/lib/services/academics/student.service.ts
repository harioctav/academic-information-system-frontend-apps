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
			return {
				...result,
				success: true,
				status: response.status,
			};
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
		formData.append("nim", request.nim);
		formData.append("name", request.name);
		formData.append("gender", request.gender);
		formData.append("religion", request.religion);
		formData.append("phone", request.phone);
		formData.append("major", request.major.toString());
		formData.append("_method", "PATCH");

		// Map optional fields
		if (request.nik) formData.append("nik", request.nik);
		if (request.email) formData.append("email", request.email);
		if (request.birth_place)
			formData.append("birth_place", request.birth_place);
		if (request.birth_date) formData.append("birth_date", request.birth_date);
		if (request.status_registration)
			formData.append("status_registration", request.status_registration);
		if (request.status_activity !== undefined)
			formData.append("status_activity", request.status_activity.toString());
		if (request.initial_registration_period)
			formData.append(
				"initial_registration_period",
				request.initial_registration_period
			);
		if (request.origin_department)
			formData.append("origin_department", request.origin_department);
		if (request.upbjj) formData.append("upbjj", request.upbjj);
		if (request.parent_name)
			formData.append("parent_name", request.parent_name);
		if (request.parent_phone_number)
			formData.append("parent_phone_number", request.parent_phone_number);

		// Handle addresses
		request.addresses.forEach((address, index) => {
			Object.entries(address).forEach(([key, value]) => {
				formData.append(`addresses[${index}][${key}]`, value.toString());
			});
		});

		if (request.student_photo_path) {
			formData.append("student_photo_path", request.student_photo_path);
		}

		return fetch(`${this.baseUrl}/${uuid}`, {
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
			return {
				...result,
				success: true,
				status: response.status,
			};
		});
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
