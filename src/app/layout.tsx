import type { Metadata } from "next";
import { Providers } from "@/components/shared/Providers";
import { Web3Provider } from "@/providers/DappKitProvider";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export const metadata: Metadata = {
	title: "MantleRWA",
	description:
		"Trade tokenized real-world assets like real estate, art, and collectibles on Mantle Network.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link
					href="https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body suppressHydrationWarning={true} style={{ fontFamily: "Inter, sans-serif" }}>
				<Web3Provider>
					<Providers>
						<Navbar />
						{children}
						<Footer />
					</Providers>
				</Web3Provider>
			</body>
		</html>
	);
}
