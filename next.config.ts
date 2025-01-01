import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const config: NextConfig = {
	// Disable source maps
	productionBrowserSourceMaps: false,
	webpack: (config) => {
		// Disable source maps in webpack
		config.devtool = false;
		// Optimize bundle
		config.optimization.minimize = true;
		config.optimization.minimizer = [];
		return config;
	},
	images: {
		domains: ["localhost"],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
		],
	},
};

export default withNextIntl(config);
