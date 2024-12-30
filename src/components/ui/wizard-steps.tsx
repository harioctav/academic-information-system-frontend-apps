import { Card } from "@/components/ui/card";

interface Step {
	title: string;
	description: string;
	icon: React.ReactNode;
}

interface WizardStepsProps {
	steps: Step[];
	currentStep: number;
	className?: string;
	children?: React.ReactNode;
}

const WizardSteps = ({
	steps,
	currentStep,
	className = "",
	children,
}: WizardStepsProps) => {
	return (
		<div className={`flex flex-col md:flex-row gap-6 w-full ${className}`}>
			{/* Left Side - Navigation */}
			<ol className="relative text-gray-500 dark:text-gray-400 w-full md:w-[240px] shrink-0">
				{steps.map((step, index) => (
					<li key={index} className="relative">
						<div
							className={`flex mb-8 ${
								index === steps.length - 1 ? "mb-0" : ""
							}`}
						>
							<div className="relative">
								<span
									className={`flex items-center justify-center w-8 h-8 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 ${
										currentStep > index + 1
											? "bg-green-200 dark:bg-green-900 text-green-500 dark:text-green-400"
											: currentStep === index + 1
											? "bg-blue-200 dark:bg-blue-900 text-blue-500 dark:text-blue-400"
											: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
									}`}
								>
									{step.icon}
								</span>
								{index !== steps.length - 1 && (
									<div className="absolute w-0.5 h-full bg-gray-200 dark:bg-gray-700 left-4 -bottom-8"></div>
								)}
							</div>
							<div className="ml-4">
								<h3 className="font-medium leading-tight dark:text-white">
									{step.title}
								</h3>
								<p className="text-sm dark:text-gray-400">{step.description}</p>
							</div>
						</div>
					</li>
				))}
			</ol>

			{/* Right Side - Form Content */}
			<Card className="flex-1 w-full">{children}</Card>
		</div>
	);
};

export default WizardSteps;
