import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactCompiler: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'upload.wikimedia.org',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'collectionapi.metmuseum.org',
				pathname: '/**',
			},
		],
	},
};

export default nextConfig;
