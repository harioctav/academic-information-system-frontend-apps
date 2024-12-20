import { ListItemProps } from "@/types/common";

export function ListItem({ label, value, maxCharacters = 50 }: ListItemProps) {
	const isLongText = value.length > maxCharacters;

	return isLongText ? (
		<li className="flex flex-col px-4 py-3">
			<span>{label}</span>
			<span className="font-semibold mt-2 text-justify">{value}</span>
		</li>
	) : (
		<li className="flex justify-between items-center px-4 py-3">
			<span>{label}</span>
			<span className="font-semibold">{value}</span>
		</li>
	);
}
