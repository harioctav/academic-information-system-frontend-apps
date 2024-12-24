"use client";

import { AsyncPaginate, LoadOptions } from "react-select-async-paginate";
import { ActionMeta, SingleValue, GroupBase, MultiValue } from "react-select";
import { ApiResponse } from "@/types/api";
import { ReactNode } from "react";

interface BaseEntity {
	id: string | number;
}

export interface SelectOption<T> {
	value: string | number;
	label: ReactNode;
	data: T;
}

type SingleSelectProps<T extends BaseEntity> = {
	isMulti?: false;
	value?: SelectOption<T> | null;
	onChange?: (
		newValue: SingleValue<SelectOption<T>>,
		actionMeta: ActionMeta<SelectOption<T>>
	) => void;
};

type MultiSelectProps<T extends BaseEntity> = {
	isMulti: true;
	value?: SelectOption<T>[] | null;
	onChange?: (
		newValue: MultiValue<SelectOption<T>>,
		actionMeta: ActionMeta<SelectOption<T>>
	) => void;
};

type AsyncSelectProps<T extends BaseEntity> = {
	placeholder?: string;
	apiUrl: string;
	onClear?: () => void;
	textFormatter: (item: T) => ReactNode;
	valueFormatter?: (item: T) => string | number;
	isClearable?: boolean;
	isDisabled?: boolean;
} & (SingleSelectProps<T> | MultiSelectProps<T>);

export function AsyncSelectInput<T extends BaseEntity>({
	placeholder,
	apiUrl,
	value,
	onChange,
	onClear,
	textFormatter,
	valueFormatter,
	isClearable = true,
	isMulti = false,
	isDisabled = false,
}: AsyncSelectProps<T>) {
	const loadOptions: LoadOptions<
		SelectOption<T>,
		GroupBase<SelectOption<T>>,
		{ page: number }
	> = async (search, _, additional) => {
		const token = document.cookie.split("token=")[1]?.split(";")[0];
		const currentPage = additional?.page || 1;

		const searchParam = search ? `search=${search}` : "";
		const url = `${apiUrl}?${searchParam}&page=${currentPage}&per_page=30`;

		const response = await fetch(url, {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
			credentials: "include",
		});

		const data = (await response.json()) as ApiResponse<T[]>;

		const options = data.data.map((item) => ({
			value: valueFormatter ? valueFormatter(item) : item.id,
			label: textFormatter(item),
			data: item,
		}));

		const currentPageNumber = data.meta?.current_page ?? 1;
		const lastPageNumber = data.meta?.last_page ?? 1;

		return {
			options,
			hasMore: currentPageNumber < lastPageNumber,
			additional: {
				page: currentPage + 1,
			},
		};
	};

	const handleChange = (
		newValue: SingleValue<SelectOption<T>> | MultiValue<SelectOption<T>>,
		actionMeta: ActionMeta<SelectOption<T>>
	) => {
		if (actionMeta.action === "clear" && onClear) {
			onClear();
		}
		if (onChange && isMulti) {
			(onChange as MultiSelectProps<T>["onChange"])?.(
				newValue as MultiValue<SelectOption<T>>,
				actionMeta
			);
		} else if (onChange) {
			(onChange as SingleSelectProps<T>["onChange"])?.(
				newValue as SingleValue<SelectOption<T>>,
				actionMeta
			);
		}
	};

	return (
		<AsyncPaginate
			value={value}
			loadOptions={loadOptions}
			onChange={handleChange}
			isClearable={isClearable}
			isMulti={isMulti}
			isDisabled={isDisabled}
			placeholder={placeholder}
			classNamePrefix="react-select"
			additional={{
				page: 1,
			}}
			debounceTimeout={300}
			styles={{
				control: (base, state) => ({
					...base,
					minHeight: "36px",
					fontSize: "14px",
					backgroundColor: "hsl(var(--background))",
					borderColor: state.isFocused
						? "hsl(var(--ring))"
						: "hsl(var(--input))",
					borderRadius: "calc(var(--radius) - 2px)",
					boxShadow: state.isFocused
						? "0 0 0 calc(1px) hsl(var(--ring) / 0.2)"
						: "none",
					"&:hover": {
						borderColor: "hsl(var(--input))",
					},
				}),
				valueContainer: (base) => ({
					...base,
					padding: "0 8px",
					gap: "4px",
				}),
				input: (base) => ({
					...base,
					color: "hsl(var(--foreground))",
					margin: 0,
					padding: 0,
					fontSize: "14px",
				}),
				placeholder: (base) => ({
					...base,
					color: "hsl(var(--muted-foreground))",
					opacity: 0.7,
					fontSize: "14px",
				}),
				menu: (base) => ({
					...base,
					backgroundColor: "hsl(var(--background))",
					border: "1px solid hsl(var(--input))",
				}),
				menuList: (base) => ({
					...base,
					backgroundColor: "hsl(var(--background))",
				}),
				singleValue: (base) => ({
					...base,
					color: "hsl(var(--foreground))",
				}),
				option: (base, state) => ({
					...base,
					fontSize: "14px",
					padding: "8px",
					backgroundColor: state.isFocused
						? "hsl(var(--accent))"
						: "transparent",
					color: state.isFocused
						? "hsl(var(--accent-foreground))"
						: "hsl(var(--foreground))",
				}),
				noOptionsMessage: (base) => ({
					...base,
					fontSize: "14px",
					color: "hsl(var(--muted-foreground))",
				}),
				loadingMessage: (base) => ({
					...base,
					fontSize: "14px",
					color: "hsl(var(--muted-foreground))",
				}),
				multiValue: (base) => ({
					...base,
					backgroundColor: "hsl(var(--accent))",
					borderRadius: "calc(var(--radius) - 4px)",
				}),
				multiValueLabel: (base) => ({
					...base,
					color: "hsl(var(--accent-foreground))",
					padding: "2px 6px",
				}),
				multiValueRemove: (base) => ({
					...base,
					color: "hsl(var(--accent-foreground))",
					"&:hover": {
						backgroundColor: "hsl(var(--destructive))",
						color: "hsl(var(--destructive-foreground))",
					},
				}),
			}}
		/>
	);
}
