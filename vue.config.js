/* eslint-disable @typescript-eslint/no-var-requires */
const { gitDescribeSync } = require("git-describe");
try {
  process.env.VUE_APP_COMMIT_HASH = gitDescribeSync().hash;
} catch (err) {
  console.warn("Cannot get Git commit hash");
}

module.exports = {
  lintOnSave: "default",

  configureWebpack: {
    resolve: {
      alias: {
        vue$: "vue/dist/vue.esm.js"
      }
    }
  },

  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "ELSA-palvelu";
      return args;
    });
  },

  devServer: {
    overlay: {
      warnings: true,
      errors: true
    },
    port: 9060,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        secure: false
      },
      "/oauth2": {
        target: "http://localhost:8080",
        secure: false
      },
      "/auth": {
        target: "http://localhost:8080",
        secure: false
      },
      "/management": {
        target: "http://localhost:8080",
        secure: false
      },
      "/swagger-resources": {
        target: "http://localhost:8080",
        secure: false
      },
      "/v2/api-docs": {
        target: "http://localhost:8080",
        secure: false
      },
      "h2-console": {
        target: "http://localhost:8080",
        secure: false
      }
    }
  },

  pluginOptions: {
    i18n: {
      locale: "fi",
      fallbackLocale: "fi",
      localeDir: "locales",
      enableInSFC: true
    }
  }
};
