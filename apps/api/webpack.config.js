"use strict"

const path = require("path")
const nodeExternals = require("webpack-node-externals")

const monorepoRoot = path.resolve(__dirname, "../../")
const monorepoModules = path.join(monorepoRoot, "node_modules")

module.exports = function (options, webpack) {
  return {
    ...options,
    resolve: {
      ...options.resolve,
      symlinks: true,
      modules: [monorepoModules, "node_modules"],
    },
    resolveLoader: {
      modules: [monorepoModules, "node_modules"],
    },
    externals: [
      nodeExternals({
        modulesDir: monorepoModules,
        allowlist: [/^@thallesp\//, /^better-auth/],
      }),
    ],
    module: {
      rules: [
        ...(options.module?.rules ?? []),
        {
          test: /\.m?js$/,
          resolve: { fullySpecified: false },
        },
      ],
    },
    plugins: [
      ...(options.plugins ?? []),
      new webpack.IgnorePlugin({ resourceRegExp: /^@nestjs\/graphql$/ }),
    ],
  }
}
