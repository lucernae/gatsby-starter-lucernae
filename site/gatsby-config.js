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
                paginationPageSize: 2,
                contentPath: `${__dirname}/content`,
                assetPath: `${__dirname}/content/assets`,
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
    ],
}