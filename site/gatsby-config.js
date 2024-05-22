require("dotenv").config()

const gatsbyThemeConfig = require(`../gatsby-theme/gatsby-config.js`)

module.exports = {
  siteMetadata: {
    ...gatsbyThemeConfig.siteMetadata,
    title: "Maulana's Gatsby Starter",
  },
  plugins: [
    {
      resolve: "gatsby-theme",
      options: {
        categoryNameForAll: "all",
        paginationPageSize: 10,
        contentPath: `${__dirname}/content`,
        assetPath: `${__dirname}/content/assets`,
        commentsEnabled: true,
        commentsProps: {
          repo: "lucernae/gatsby-starter-lucernae",
          repoId:"R_kgDOKRTVcw",
          category: "Announcements",
          categoryId: "DIC_kwDOKRTVc84CaVF-",
          mapping: "url",
          strict: "0",
          reactionsEnabled: "1",
          emitMetadata: "1",
          inputPosition: "top",
          theme: "preferred_color_scheme",
          lang: "en",
          loading: "lazy",
        },
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content`,
        name: `content`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId: process.env.GATSBY_ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_ADMIN_KEY,
        dryRun: process.env.GATSBY_ALGOLIA_DRY_RUN === 'true',
        queries: require("../gatsby-theme/src/utils/algolia-queries")
      }
    },
  ],
}
