import { format, parse, differenceInYears } from "date-fns";
import { id } from "date-fns/locale";

export function formatDate(dateString: string): string {
	const date = parse(dateString, "yyyy-MM-dd", new Date());
	return format(date, "EEEE, d MMMM yyyy", { locale: id });
}

export function calculateAge(birthDate: string): number {
	const date = parse(birthDate, "yyyy-MM-dd", new Date());
	return differenceInYears(new Date(), date);
}
