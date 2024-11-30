import type { NextConfig } from "next";

const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
	/* config options here */
};

module.exports = withNextIntl(nextConfig);
