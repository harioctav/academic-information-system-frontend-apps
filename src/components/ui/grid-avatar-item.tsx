import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GridAvatarItemProps {
	avatar?: string | null;
	fullWidth?: boolean;
	className?: string;
	centered?: boolean;
}

export function GridAvatarItem({
	avatar,
	fullWidth = false,
	className = "",
	centered = true,
}: GridAvatarItemProps) {
	return (
		<div className={`${fullWidth ? "md:col-span-2" : ""} ${className}`}>
			<div className={`flex ${centered ? "justify-center" : ""}`}>
				<Avatar className="h-24 w-24">
					<AvatarImage src={avatar || ""} alt="Profile avatar" />
					<AvatarFallback>Avatar</AvatarFallback>
				</Avatar>
			</div>
		</div>
	);
}
