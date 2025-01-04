"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Subject } from "@/types/academics/subject";
import { useState, useEffect } from "react";

interface RecommendationFormProps {
	selectedSubjects: Subject[];
}

export function RecommendationForm({
	selectedSubjects,
}: RecommendationFormProps) {
	const [totalSKS, setTotalSKS] = useState(0);

	useEffect(() => {
		const total = selectedSubjects.reduce(
			(sum, subject) => sum + Number(subject.course_credit),
			0
		);
		setTotalSKS(total);
	}, [selectedSubjects]);

	return (
		<Card className="mt-4">
			<CardContent className="pt-6">
				<div className="grid w-full items-center gap-4">
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="totalSKS">Jumlah SKS Diambil</Label>
						<Input
							id="totalSKS"
							value={totalSKS}
							disabled
							className="w-full md:w-[200px]"
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
