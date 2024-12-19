import { Permission } from "@/types/settings/permission";
import { PermissionCategory } from "@/types/settings/permission-category";

export interface FormProps {
	uuid?: string;
	isEdit?: boolean;
	onSuccess?: () => void;
}

export interface RegionDialogProps {
	isOpen: boolean;
	onClose: () => void;
	uuid?: string;
	onSuccess?: () => void;
}

export interface DashboardCardProps {
	title: string;
	value: string;
	metric: string;
	change: number;
}

export default interface PermissionCategoryCardProps {
	category: PermissionCategory;
	selectedPermissions: string[];
	onPermissionChange: (permission: Permission) => void;
	onCategoryChange: (permissions: Permission[]) => void;
}

export interface ImageInputProps {
	value?: string | null;
	onChange?: (file?: File) => void;
	onRemove?: () => void;
	name: string;
	disabled?: boolean;
	fallback?: string;
}

export interface NameInputProps {
	value: string;
	onChange: (value: string) => void;
	error?: string;
	disabled?: boolean;
}

export interface PhoneInputProps {
	value: string | undefined;
	onChange: (value: string) => void;
	error?: string;
	disabled?: boolean;
}

export interface EmailInputProps {
	value: string;
	onChange: (value: string) => void;
	error?: string;
	disabled?: boolean;
}

export interface PosCodeInputProps {
	value: string;
	onChange: (value: string) => void;
	error?: string;
	disabled?: boolean;
}

export interface CodeInputProps {
	value: string;
	onChange: (value: string) => void;
	error?: string;
	disabled?: boolean;
}
