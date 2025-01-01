import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

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
					<AvatarImage
						src={avatar || "/assets/images/default-avatar.png"}
						alt="Profile avatar"
					/>
					<AvatarFallback>
						<Image
							src="/assets/images/default-avatar.png"
							alt="Default avatar"
							width={96}
							height={96}
						/>
					</AvatarFallback>
				</Avatar>
			</div>
		</div>
	);
}
