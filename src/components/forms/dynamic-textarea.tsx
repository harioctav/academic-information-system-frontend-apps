import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { ChangeEvent } from "react";

interface DynamicTextareaProps {
	name: string;
	label: string;
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
	error?: string;
	disabled?: boolean;
	rows?: number;
}

export const DynamicTextarea = ({
	name,
	label,
	placeholder,
	value,
	onChange,
	error,
	disabled,
	rows = 4,
}: DynamicTextareaProps) => {
	const t = useTranslations();

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		onChange(e.target.value);
	};

	return (
		<div className="space-y-2">
			<Label htmlFor={name} className="block text-sm font-medium mb-2">
				{label}
			</Label>
			<Textarea
				id={name}
				name={name}
				placeholder={
					placeholder || t("input.common.placeholder", { field: label })
				}
				value={value}
				onChange={handleChange}
				className="w-full"
				disabled={disabled}
				rows={rows}
			/>
			{error && <span className="text-sm text-red-500">{error}</span>}
		</div>
	);
};
