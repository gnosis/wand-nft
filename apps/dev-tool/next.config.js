const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.hbs/,
      use: [
        {
          loader: "handlebars-loader",
          options: {
            partialDirs: [
              path.join(
                __dirname,
                "..",
                "..",
                "contracts",
                "contracts",
                "svg",
                "partials"
              ),
            ],
            helperResolver(helper, callback) {
              if (helper.startsWith("./uint") || helper.startsWith("./int")) {
                callback(
                  null,
                  path.join(__dirname, "./handlebars-helpers", "int-helper.js")
                );
              } else {
                callback();
              }
            },
          },
        },
      ],
    });
    return config;
  },
};

module.exports = nextConfig;
