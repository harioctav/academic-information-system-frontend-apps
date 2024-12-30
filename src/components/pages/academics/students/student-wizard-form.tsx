"use client";

import { studentService } from "@/lib/services/academics/student.service";
import { ApiError, ValidationErrors } from "@/types/api";
import {
	Cake,
	Check,
	CheckCircle,
	ChevronLeft,
	ChevronRight,
	GraduationCap,
	MapPin,
	User,
	Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import BasicInformationStep from "./steps/basic-information";
import BirthStatusStep from "./steps/birth-status";
import AcademicInformationStep from "./steps/academic-information";
import AddressInformationStep from "./steps/address-information";
import ParentInformationStep from "./steps/parent-information";
import ConfirmationStep from "./steps/confirmation-step";
import WizardSteps from "@/components/ui/wizard-steps";
import {
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StudentRequest } from "@/types/academics/student";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";

interface StudentWizardFormProps {
	uuid?: string;
	isEdit?: boolean;
	initialData?: StudentRequest;
	photoUrl?: string | null;
}

const StudentWizardForm = ({
	uuid,
	isEdit,
	initialData,
	photoUrl,
}: StudentWizardFormProps) => {
	const t = useTranslations();
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);

	const [formData, setFormData] = useState<StudentRequest>(
		initialData || {
			nim: "",
			name: "",
			gender: "",
			religion: "",
			phone: "",
			major: 0,
			addresses: [],
		}
	);

	const steps = [
		{
			title: t("steps.basic_information.title"),
			description: t("steps.basic_information.description"),
			icon: <User className="w-4 h-4" />,
		},
		{
			title: t("steps.birth_status.title"),
			description: t("steps.birth_status.description"),
			icon: <Cake className="w-4 h-4" />,
		},
		{
			title: t("steps.academic_information.title"),
			description: t("steps.academic_information.description"),
			icon: <GraduationCap className="w-4 h-4" />,
		},
		{
			title: t("steps.address_information.title"),
			description: t("steps.address_information.description"),
			icon: <MapPin className="w-4 h-4" />,
		},
		{
			title: t("steps.parent_information.title"),
			description: t("steps.parent_information.description"),
			icon: <Users className="w-4 h-4" />,
		},
		{
			title: t("steps.confirmation_data.title"),
			description: t("steps.confirmation_data.description"),
			icon: <CheckCircle className="w-4 h-4" />,
		},
	];

	const validateBasicInformation = () => {
		const errors: ValidationErrors = {};

		if (!formData.nim.trim()) {
			errors.nim = [
				t("validation.required", { field: t("input.common.nim.label") }),
			];
		}
		if (!formData.name.trim()) {
			errors.name = [
				t("validation.required", { field: t("input.common.name.label") }),
			];
		}
		if (!formData.email?.trim()) {
			errors.email = [
				t("validation.required", { field: t("input.user.email.label") }),
			];
		}
		if (!formData.phone?.trim()) {
			errors.phone = [
				t("validation.required", { field: t("input.user.phone.label") }),
			];
		}
		if (!formData.religion) {
			errors.religion = [
				t("validation.required", { field: t("input.common.religion.label") }),
			];
		}

		return errors;
	};

	const validateBirthStatus = () => {
		const errors: ValidationErrors = {};

		if (!formData.nik?.trim()) {
			errors.nik = [
				t("validation.required", { field: t("input.common.nik.label") }),
			];
		}
		if (formData.nik && formData.nik.length !== 16) {
			errors.nik = [
				t("validation.digits", {
					field: t("input.common.nik.label"),
					digits: 16,
				}),
			];
		}
		if (!formData.gender) {
			errors.gender = [
				t("validation.required", { field: t("input.common.gender.label") }),
			];
		}
		if (!formData.birth_place?.trim()) {
			errors.birth_place = [
				t("validation.required", {
					field: t("input.common.birth_place.label"),
				}),
			];
		}
		if (!formData.birth_date) {
			errors.birth_date = [
				t("validation.required", { field: t("input.common.birth_date.label") }),
			];
		}

		return errors;
	};

	const validateAcademicInformation = () => {
		const errors: ValidationErrors = {};

		if (!formData.initial_registration_period?.trim()) {
			errors.initial_registration_period = [
				t("validation.required", {
					field: t("input.common.initial_registration_period.label"),
				}),
			];
		}

		if (formData.initial_registration_period) {
			const regex = /^[0-9]{4}\s(GANJIL|GENAP)$/;
			if (!regex.test(formData.initial_registration_period)) {
				errors.initial_registration_period = [
					t("validation.registration_period_format"),
				];
				return errors;
			}

			const [year, semester] = formData.initial_registration_period.split(" ");
			const yearNum = parseInt(year);
			const currentYear = new Date().getFullYear();

			if (yearNum < 2019 || yearNum > currentYear + 1) {
				errors.initial_registration_period = [
					t("validation.year_range", { min: 2019, max: currentYear + 1 }),
				];
				return errors;
			}

			if (!["GANJIL", "GENAP"].includes(semester)) {
				errors.initial_registration_period = [t("validation.semester_options")];
				return errors;
			}
		}

		if (!formData.origin_department?.trim()) {
			errors.origin_department = [
				t("validation.required", {
					field: t("input.common.origin_department.label"),
				}),
			];
		}
		if (!formData.upbjj?.trim()) {
			errors.upbjj = [
				t("validation.required", { field: t("input.common.upbjj.label") }),
			];
		}
		if (!formData.major) {
			errors.major = [
				t("validation.required", { field: t("module.academic.majors") }),
			];
		}
		if (!formData.status_registration) {
			errors.status_registration = [
				t("validation.required", {
					field: t("input.common.status_registration.label"),
				}),
			];
		}
		if (formData.status_activity === undefined) {
			errors.status_activity = [
				t("validation.required", {
					field: t("input.common.status_activity.label"),
				}),
			];
		}

		return errors;
	};

	const validateAddressInformation = () => {
		const errors: ValidationErrors = {};

		if (!formData.addresses || formData.addresses.length === 0) {
			errors.addresses = [
				t("validation.required", { field: t("input.location.address.label") }),
			];
			return errors;
		}

		formData.addresses.forEach((address, index) => {
			if (!address.province_id) {
				errors[`addresses.${index}.province_id`] = [
					t("validation.required", {
						field: t("input.location.province.label"),
					}),
				];
			}
			if (!address.regency_id) {
				errors[`addresses.${index}.regency_id`] = [
					t("validation.required", {
						field: t("input.location.regency.label"),
					}),
				];
			}
			if (!address.district_id) {
				errors[`addresses.${index}.district_id`] = [
					t("validation.required", {
						field: t("input.location.district.label"),
					}),
				];
			}
			if (!address.village_id) {
				errors[`addresses.${index}.village_id`] = [
					t("validation.required", {
						field: t("input.location.village.label"),
					}),
				];
			}
			if (!address.address?.trim()) {
				errors[`addresses.${index}.address`] = [
					t("validation.required", {
						field: t("input.location.address.label"),
					}),
				];
			}
		});

		return errors;
	};

	const validateParentInformation = () => {
		const errors: ValidationErrors = {};

		if (!formData.parent_name?.trim()) {
			errors.parent_name = [
				t("validation.required", {
					field: t("input.common.parent_name.label"),
				}),
			];
		}
		if (!formData.parent_phone_number?.trim()) {
			errors.parent_phone_number = [
				t("validation.required", {
					field: t("input.common.parent_phone_number.label"),
				}),
			];
		}

		return errors;
	};

	const handleNext = () => {
		let stepErrors = {};

		switch (currentStep) {
			case 1:
				stepErrors = validateBasicInformation();
				break;
			case 2:
				stepErrors = validateBirthStatus();
				break;
			case 3:
				stepErrors = validateAcademicInformation();
				break;
			case 4:
				stepErrors = validateAddressInformation();
				break;
			case 5:
				stepErrors = validateParentInformation();
				break;
		}

		if (Object.keys(stepErrors).length > 0) {
			setErrors(stepErrors);
			return;
		}

		setErrors({});
		setCurrentStep((prev) => Math.min(prev + 1, steps.length));
	};

	const handlePrev = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 1));
		setErrors({});
	};

	const handleSubmitClick = () => {
		setShowConfirmDialog(true);
	};

	const handleSubmit = async () => {
		setIsLoading(true);
		try {
			const submissionData: StudentRequest = {
				...formData,
				major: Number(formData.major),
				addresses: formData.addresses.map((address) => ({
					...address,
					province_id: Number(address.province_id),
					regency_id: Number(address.regency_id),
					district_id: Number(address.district_id),
					village_id: Number(address.village_id),
				})),
			};

			if (isEdit && uuid) {
				const response = await studentService.updateStudent(
					uuid,
					submissionData
				);
				toast.success(response.message);
			} else {
				const response = await studentService.storeStudent(submissionData);
				toast.success(response.message);
			}
			router.refresh();
			router.push("/academics/students");
		} catch (error) {
			const apiError = error as ApiError;
			if (apiError.errors) {
				setErrors(apiError.errors);

				// Determine which step has errors and navigate to it
				if (
					apiError.errors.nim ||
					apiError.errors.name ||
					apiError.errors.email ||
					apiError.errors.phone ||
					apiError.errors.religion
				) {
					setCurrentStep(1); // Basic Information
				} else if (
					apiError.errors.nik ||
					apiError.errors.gender ||
					apiError.errors.birth_place ||
					apiError.errors.birth_date
				) {
					setCurrentStep(2); // Birth Status
				} else if (
					apiError.errors.major ||
					apiError.errors.initial_registration_period ||
					apiError.errors.origin_department ||
					apiError.errors.upbjj ||
					apiError.errors.status_registration ||
					apiError.errors.status_activity
				) {
					setCurrentStep(3); // Academic Information
				} else if (apiError.errors.addresses) {
					setCurrentStep(4); // Address Information
				} else if (
					apiError.errors.parent_name ||
					apiError.errors.parent_phone_number
				) {
					setCurrentStep(5); // Parent Information
				}
			}
			toast.error(apiError.message || t("message.error.save"));
		} finally {
			setIsLoading(false);
			setShowConfirmDialog(false);
		}
	};

	const renderStep = () => {
		switch (currentStep) {
			case 1:
				return (
					<BasicInformationStep
						formData={formData}
						setFormData={setFormData}
						errors={errors}
						isLoading={isLoading}
						photoUrl={photoUrl}
					/>
				);
			case 2:
				return (
					<BirthStatusStep
						formData={formData}
						setFormData={setFormData}
						errors={errors}
						isLoading={isLoading}
					/>
				);
			case 3:
				return (
					<AcademicInformationStep
						formData={formData}
						setFormData={setFormData}
						errors={errors}
						isLoading={isLoading}
					/>
				);
			case 4:
				return (
					<AddressInformationStep
						formData={formData}
						setFormData={setFormData}
						errors={errors}
						isLoading={isLoading}
					/>
				);
			case 5:
				return (
					<ParentInformationStep
						formData={formData}
						setFormData={setFormData}
						errors={errors}
						isLoading={isLoading}
					/>
				);
			case 6:
				return <ConfirmationStep formData={formData} />;
			default:
				return null;
		}
	};

	return (
		<div className="max-w-7xl mx-auto my-3">
			<WizardSteps steps={steps} currentStep={currentStep} className="mb-1">
				<div className="flex flex-col h-[600px]">
					<CardHeader className="flex-none">
						<CardTitle>{steps[currentStep - 1].title}</CardTitle>
						<CardDescription>
							{steps[currentStep - 1].description}
						</CardDescription>
					</CardHeader>

					<CardContent className="flex-1 overflow-auto">
						{renderStep()}
					</CardContent>

					<div className="flex-none">
						<Separator className="my-4" />
						<CardFooter className="flex justify-between">
							{currentStep > 1 && (
								<Button
									onClick={handlePrev}
									variant="outline"
									disabled={isLoading}
									size="sm"
								>
									<ChevronLeft className="mr-1 w-4 h-4" />
									{t("table.pagination.previous")}
								</Button>
							)}

							{currentStep < steps.length ? (
								<Button
									onClick={handleNext}
									disabled={isLoading}
									className="ml-auto"
									size="sm"
								>
									{t("table.pagination.next")}
									<ChevronRight className="ml-1 w-4 h-4" />
								</Button>
							) : (
								<SubmitButton
									onClick={handleSubmitClick}
									isLoading={isLoading}
									variant="secondary"
									className="ml-auto"
									size="sm"
								>
									<Check className="mr-1 w-4 h-4" />
									{t("button.common.create")}
								</SubmitButton>
							)}
						</CardFooter>
					</div>
				</div>
			</WizardSteps>

			<ConfirmationDialog
				isOpen={showConfirmDialog}
				onClose={() => setShowConfirmDialog(false)}
				onConfirm={handleSubmit}
				title={t("dialog.submit.title")}
				description={t("dialog.submit.description")}
				confirmText={t("button.common.continue")}
				cancelText={t("button.common.cancel")}
			/>
		</div>
	);
};

export default StudentWizardForm;
