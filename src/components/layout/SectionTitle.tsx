import React from 'react';

interface SectionTitleProps {
	title: string;
	subtitle?: string;
	cta?: React.ReactNode;
}

export function SectionTitle({ title, subtitle, cta }: SectionTitleProps) {
	return (
		<div className="mb-6 flex items-center justify-between">
			<div>
				<h1 className="text-2xl font-bold text-gray-900">{title}</h1>
				{subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
			</div>
			{cta && <div>{cta}</div>}
		</div>
	);
}
