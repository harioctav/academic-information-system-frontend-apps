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
