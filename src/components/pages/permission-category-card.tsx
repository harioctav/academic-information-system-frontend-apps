import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	getPermissionCategoryLabel,
	getPermissionLabel,
} from "@/config/enums/permission.category.enum";
import { useTranslations } from "next-intl";
import PermissionCategoryCardProps from "@/types/common";

const PermissionCategoryCard = ({
	category,
	selectedPermissions,
	onPermissionChange,
	onCategoryChange,
}: PermissionCategoryCardProps) => {
	const hasSelectedPermissions = category.permissions.some((p) =>
		selectedPermissions.includes(p.name)
	);

	const t = useTranslations();

	return (
		<Card>
			<Accordion
				type="single"
				collapsible
				defaultValue={hasSelectedPermissions ? "permissions" : undefined}
			>
				<AccordionItem value="permissions">
					<div className="flex items-center justify-between px-6">
						<div className="flex items-center space-x-2">
							<Checkbox
								id={`category-${category.uuid}`}
								checked={category.permissions.every((p) =>
									selectedPermissions.includes(p.name)
								)}
								onCheckedChange={() => onCategoryChange(category.permissions)}
							/>
							<Label
								htmlFor={`category-${category.uuid}`}
								className="font-medium"
							>
								{`${t(getPermissionCategoryLabel(category.name))} ${t(
									"module.title"
								)}`}
							</Label>
						</div>
						<AccordionTrigger />
					</div>
					<AccordionContent className="border-t pt-4">
						<div className="space-y-2 px-6">
							{category.permissions.map((permission) => {
								const label = getPermissionLabel(permission.name);
								const translatedLabel =
									typeof label === "string"
										? t(label)
										: `${t(label.action)} ${t(label.module)}`;

								return (
									<div
										key={permission.uuid}
										className="flex items-center space-x-2"
									>
										<Checkbox
											id={`permission-${permission.uuid}`}
											checked={selectedPermissions.includes(permission.name)}
											onCheckedChange={() => onPermissionChange(permission)}
										/>
										<Label
											htmlFor={`permission-${permission.uuid}`}
											className="text-sm"
										>
											{translatedLabel}
										</Label>
									</div>
								);
							})}
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</Card>
	);
};

export default PermissionCategoryCard;
