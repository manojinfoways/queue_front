const withPlugins = require('next-compose-plugins');
const withSass = require('@zeit/next-sass');
const withImages = require('next-images');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.BUNDLE_ANALYZE === 'true',
});

const nextConfig = {
	env: {
		API_URL: 'http://54.177.158.210:3001/apiv1/',
	}
};

module.exports = withBundleAnalyzer(nextConfig, withPlugins([[withSass(), withImages()]]));