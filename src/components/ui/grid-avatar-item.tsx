import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import Image from "next/image";

interface GridAvatarItemProps {
	avatar?: string | null;
	fullWidth?: boolean;
	className?: string;
	centered?: boolean;
	onDeleteImage?: () => void;
	showDeleteButton?: boolean;
}

export function GridAvatarItem({
	avatar,
	fullWidth = false,
	className = "",
	centered = true,
	onDeleteImage,
	showDeleteButton = false,
}: GridAvatarItemProps) {
	return (
		<div className={`${fullWidth ? "md:col-span-2" : ""} ${className}`}>
			<div className={`flex ${centered ? "justify-center" : ""}`}>
				<div className="relative">
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
					{showDeleteButton && avatar && (
						<button
							onClick={onDeleteImage}
							className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
							type="button"
						>
							<X className="h-4 w-4" />
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
