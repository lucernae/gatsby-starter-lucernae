require(`dotenv`).config()

const gatsbyThemeConfig = require(`../gatsby-theme/gatsby-config.js`)
const algoliaIndexName = `Pages_${process.env.DEPLOY_ENVIRONMENT ?? 'testing'}`

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
        algoliaProps: {
          indexName: algoliaIndexName,
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
        appId: process.env.GATSBY_ALGOLIA_APP_ID ?? '',
        apiKey: process.env.GATSBY_ALGOLIA_WRITE_KEY ?? '',
        dryRun: process.env.GATSBY_ALGOLIA_DRY_RUN === 'true',
        continueOnFailure: process.env.GATSBY_ALGOLIA_CONTINUE_ON_FAILURE === 'true',
        queries: (() => {
          const q = require("../gatsby-theme/src/utils/algolia-queries")
          return q.map((item) => {
            const result = {
              ...item,
              indexName: algoliaIndexName,
            }
            return result
          })
        })(),
      }
    },
  ],
}
