/* eslint-disable @typescript-eslint/no-var-requires */
import { withSentryConfig } from '@sentry/nextjs';
import { withAxiom } from 'next-axiom';
import path from 'path';
import { fileURLToPath } from 'url';
import BundleAnalyzer from '@next/bundle-analyzer';
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
import smartRouterPkgs from '@dapp/smart-router/package.json' assert { type: 'json' };
import { withWebSecurityHeaders } from '@dapp/next-config/withWebSecurityHeaders';
import { DeleteSourceMapsPlugin } from 'webpack-delete-sourcemaps-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const withBundleAnalyzer = BundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withVanillaExtract = createVanillaExtractPlugin();

const sentryWebpackPluginOptions =
  process.env.VERCEL_ENV === 'production'
    ? {
        // Additional config options for the Sentry Webpack plugin. Keep in mind that
        // the following options are set automatically, and overriding them is not
        // recommended:
        //   release, url, org, project, authToken, configFile, stripPrefix,
        //   urlPrefix, include, ignore
        silent: false, // Logging when deploying to check if there is any problem
        validate: true,
        hideSourceMaps: true,

        // https://github.com/getsentry/sentry-webpack-plugin#options.
      }
    : {
        hideSourceMaps: true,
        silent: true, // Suppresses all logs
        dryRun: !process.env.SENTRY_AUTH_TOKEN,
      };

const workerDeps = Object.keys(smartRouterPkgs.dependencies)
  .map((d) => d.replace('@dapp/', 'packages/'))
  .concat(['/packages/smart-router/', '/packages/swap-sdk/', '/packages/token-lists/']);

/** @type {import('next').NextConfig} */

const config = {
  // sentry: {
  //   hideSourceMaps: true,
  // },
  compiler: {
    styledComponents: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },

  experimental: {
    scrollRestoration: true,
    outputFileTracingRoot: path.join(__dirname, '../../'),
    outputFileTracingExcludes: {
      '*': ['**@swc+core*', '**/@esbuild**'],
    },
  },
  transpilePackages: ['@dapp/farms', '@dapp/hooks', '@dapp/utils', '@dapp/widgets-internal'],
  reactStrictMode: true,
  swcMinify: true,

  images: {
    contentDispositionType: 'attachment',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static-nft.gempad.com',
        pathname: '/mainnet/**',
      },
    ],
  },

  webpack: (webpackConfig, { webpack, isServer }) => {
   
    // tree shake sentry tracing
    webpackConfig.plugins.push(
      new webpack.DefinePlugin({
        __SENTRY_DEBUG__: false,
        __SENTRY_TRACING__: false,
      }),
    );

    // TODO: need to uncomment it for production
    // webpackConfig.plugins.push(
    //   new DeleteSourceMapsPlugin({ isServer, keepServerSourcemaps: true }),
    // );

    // if (!isServer && webpackConfig.optimization.splitChunks) {
    //   // webpack doesn't understand worker deps on quote worker, so we need to manually add them
    //   // https://github.com/webpack/webpack/issues/16895
    //   // eslint-disable-next-line no-param-reassign
    //   webpackConfig.webpackConfig.optimization.splitChunks.cacheGroups.workerChunks = {
    //     chunks: 'all',
    //     test(module) {
    //       const resource = module.nameForCondition?.() ?? '';
    //       return resource ? workerDeps.some((d) => resource.includes(d)) : false;
    //     },
    //     priority: 31,
    //     name: 'worker-chunks',
    //     reuseExistingChunk: true,
    //   };
    // }

    // Configures webpack to handle SVG files with SVGR. SVGR optimizes and transforms SVG files
    // into React components. See https://react-svgr.com/docs/next/

    // Grab the existing rule that handles SVG imports
    // @ts-ignore - rules is a private property that is not typed
    const fileLoaderRule = webpackConfig.module.rules.find((rule) => rule.test?.test?.('.svg'));

    webpackConfig.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;
    return webpackConfig;
  },
};

export default withBundleAnalyzer(
  withVanillaExtract(
    withSentryConfig(withAxiom(withWebSecurityHeaders(config)), sentryWebpackPluginOptions),
  ),
);





