"use client";

import { Upload, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useState } from "react";

interface UploadImageProps {
	onImageUpload?: (file: File) => void;
	initialImage?: string | null;
	onDeleteImage?: () => void;
}

const UploadImage = ({
	onImageUpload,
	initialImage,
	onDeleteImage,
}: UploadImageProps) => {
	const t = useTranslations();
	const [preview, setPreview] = useState<string | null>(null);

	useEffect(() => {
		setPreview(initialImage || null);
	}, [initialImage]);

	const handleDelete = (e: React.MouseEvent) => {
		e.preventDefault();
		if (onDeleteImage) {
			onDeleteImage();
		}
	};

	const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onloadend = () => {
			setPreview(reader.result as string);
		};
		reader.readAsDataURL(file);

		if (onImageUpload) {
			onImageUpload(file);
		}
	};

	return (
		<div>
			<div className="relative w-32 h-32">
				<label
					htmlFor="image-upload"
					className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
				>
					{preview ? (
						<div className="relative w-full h-full">
							<Image
								src={preview}
								alt="Preview"
								fill
								className="object-cover rounded-lg"
								unoptimized
							/>
							<button
								type="button"
								onClick={handleDelete}
								className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
							>
								<X className="w-4 h-4" />
							</button>
						</div>
					) : (
						<div className="flex flex-col items-center justify-center p-4 text-gray-500">
							<Upload className="w-8 h-8 mb-2" />
							<span className="text-xs text-center">
								{t("input.common.image.placeholder")}
							</span>
						</div>
					)}
					<input
						id="image-upload"
						type="file"
						className="hidden"
						accept="image/*"
						onChange={handleImageChange}
					/>
				</label>
			</div>
			<p className="mt-2 text-sm text-muted-foreground">
				{t("input.common.image.helper")}
			</p>
		</div>
	);
};

export default UploadImage;
