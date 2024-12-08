import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

interface SearchInputProps {
	value: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onClear: () => void;
}

export function SearchInput({ value, onChange, onClear }: SearchInputProps) {
	const t = useTranslations();

	return (
		<div className="relative w-full sm:w-auto">
			<Input
				placeholder={t("input.common.search.placeholder")}
				value={value}
				onChange={onChange}
				className="w-full pr-8"
			/>
			{value && (
				<button
					onClick={onClear}
					className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
				>
					<X className="h-4 w-4" />
				</button>
			)}
		</div>
	);
}
