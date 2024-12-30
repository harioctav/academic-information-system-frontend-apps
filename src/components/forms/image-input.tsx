import React from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ImageInputProps } from "@/types/common";

const ImageInput = ({
	value,
	onChange,
	name,
	disabled = false,
	fallback,
}: ImageInputProps) => {
	const [preview, setPreview] = React.useState<string | null>(null);
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	React.useEffect(() => {
		return () => {
			if (preview) {
				URL.revokeObjectURL(preview);
			}
		};
	}, [preview]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const previewUrl = URL.createObjectURL(file);
			setPreview(previewUrl);
			onChange?.(file);
		}
	};

	const imageSource = preview || value || null;

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-4 mb-5">
				<Avatar className="w-20 h-20">
					{imageSource && <AvatarImage src={imageSource} alt={name} />}
					<AvatarFallback>
						{fallback || name.charAt(0).toUpperCase()}
					</AvatarFallback>
				</Avatar>
			</div>

			<Input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={handleImageChange}
				className="w-full"
				disabled={disabled}
			/>
		</div>
	);
};

export default ImageInput;
