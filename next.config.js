const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
});
/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	output: 'standalone',
	images: {
		domains: ['192.168.4.4'],
	},
	publicRuntimeConfig: {
		SERVER_URL: process.env.SERVER_URL,
	},
};

module.exports = withBundleAnalyzer(nextConfig);
