import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface DatePickerProps {
	date?: string;
	onSelect: (date: string) => void;
	disabled?: boolean;
	placeholder?: string;
	maxDate?: Date;
}

export function DatePicker({
	date,
	onSelect,
	disabled,
	placeholder = "Pick a date",
	maxDate = new Date(),
}: DatePickerProps) {
	const [selectedDate, setSelectedDate] = useState<Date>(
		date ? new Date(date) : new Date()
	);

	const months = {
		january: "Januari",
		february: "Februari",
		march: "Maret",
		april: "April",
		may: "Mei",
		june: "Juni",
		july: "Juli",
		august: "Agustus",
		september: "September",
		october: "Oktober",
		november: "November",
		december: "Desember",
	};

	const years = Array.from(
		{ length: maxDate.getFullYear() - 1900 + 1 },
		(_, i) => 1900 + i
	);

	const handleMonthChange = (month: string) => {
		const monthIndex = Object.values(months).indexOf(month);
		const newDate = setMonth(selectedDate, monthIndex);
		setSelectedDate(newDate);
	};

	const handleYearChange = (year: string) => {
		const newDate = setYear(selectedDate, parseInt(year));
		setSelectedDate(newDate);
	};

	const handleDateSelect = (newDate: Date | undefined) => {
		if (newDate) {
			const localDate = new Date(
				newDate.getTime() - newDate.getTimezoneOffset() * 60000
			);
			onSelect(localDate.toISOString().split("T")[0]);
		} else {
			onSelect("");
		}
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-full justify-start text-left font-normal",
						!date && "text-muted-foreground"
					)}
					disabled={disabled}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? format(new Date(date), "PPP") : <span>{placeholder}</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<div className="flex justify-between p-2">
					<Select
						onValueChange={handleMonthChange}
						value={Object.values(months)[getMonth(selectedDate)]}
					>
						<SelectTrigger className="w-[110px]">
							<SelectValue placeholder="Month" />
						</SelectTrigger>
						<SelectContent>
							{Object.values(months).map((month) => (
								<SelectItem key={month} value={month}>
									{month}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select
						onValueChange={handleYearChange}
						value={getYear(selectedDate).toString()}
					>
						<SelectTrigger className="w-[110px]">
							<SelectValue placeholder="Year" />
						</SelectTrigger>
						<SelectContent>
							{years.map((year) => (
								<SelectItem key={year} value={year.toString()}>
									{year}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<Calendar
					mode="single"
					selected={date ? new Date(date) : undefined}
					onSelect={handleDateSelect}
					initialFocus
					fromDate={undefined}
					toDate={maxDate}
					month={selectedDate}
					onMonthChange={setSelectedDate}
				/>
			</PopoverContent>
		</Popover>
	);
}
