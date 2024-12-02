"use client";

import { useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SelectSeparator,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface SelectOption {
	value: string;
	label: string;
}

interface DynamicSelectProps {
	value: string | undefined;
	onChange: (value: string | undefined) => void;
	options: SelectOption[];
	placeholder?: string;
	className?: string;
}

export function DynamicSelect({
	value,
	onChange,
	options,
	placeholder = "Select Option",
	className,
}: DynamicSelectProps) {
	const [key, setKey] = useState(+new Date());

	const handleChange = (newValue: string) => {
		onChange(newValue);
	};

	return (
		<div className={className}>
			<Select key={key} value={value} onValueChange={handleChange}>
				<SelectTrigger>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
					<SelectSeparator />
					<Button
						className="w-full px-2"
						variant="secondary"
						size="sm"
						onClick={(e) => {
							e.stopPropagation();
							onChange(undefined);
							setKey(+new Date());
						}}
					>
						Clear
					</Button>
				</SelectContent>
			</Select>
		</div>
	);
}
