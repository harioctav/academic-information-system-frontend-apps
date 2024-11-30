import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const config: NextConfig = {
	productionBrowserSourceMaps: false,
	webpack: (config) => {
		config.devtool = false;
		return config;
	},
};

export default withNextIntl(config);
