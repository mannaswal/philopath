import type { Metadata } from 'next';
import { EB_Garamond, Manrope } from 'next/font/google';
import { ConvexClientProvider } from './ConvexClientProvider';
import './globals.css';
import { cn } from "@/lib/utils";

const manrope = Manrope({subsets:['latin'],variable:'--font-sans'});

const ebGaramond = EB_Garamond({
	variable: '--font-eb-garamond',
	subsets: ['latin'],
	style: ['normal', 'italic'],
});

export const metadata: Metadata = {
	title: 'Philopath',
	description: 'A journey through the history of philosophy',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={cn("h-full", "antialiased", ebGaramond.variable, "font-sans", manrope.variable)}>
			<body className="min-h-full flex flex-col font-serif">
				<ConvexClientProvider>{children}</ConvexClientProvider>
			</body>
		</html>
	);
}
