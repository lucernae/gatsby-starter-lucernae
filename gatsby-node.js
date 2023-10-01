/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const slugify = require(`@sindresorhus/slugify`)
const { compileMDXWithCustomOptions } = require(`gatsby-plugin-mdx`)
const { remarkHeadingsPlugin } = require(`./remark-headings-plugin`)
const { node } = require('prop-types')
const { siteMetadata } = require('./gatsby-config')

const createIndexPage = async ({actions, post, postCount, categoriesList}) => {
  const { createPage } = actions
  const limit = siteMetadata.config.paginationPageSize
  const layout = post.frontmatter.layout || 'index-post'
  const template = path.resolve(`./src/templates/${layout}.js`)
  for(let i=0; i<postCount; i+=limit) {
    let path = post.fields.slug
    if(i!=0){
      let pageIndex = Math.floor(i/limit) + 1
      if(path === "/") {
        path = `/index-page/${pageIndex}`
      } else {
        path = `${path}/index-page/${pageIndex}`
      }
    }
    let categoriesFilter = [post.frontmatter.category]
    if(post.frontmatter.category === siteMetadata.config.categoryNameForAll) {
      categoriesFilter = categoriesList
    }
    createPage({
      path: path,
      component: `${template}?__contentFilePath=${post.internal.contentFilePath}`,
      context: {
        id: post.id,
        slug: post.fields.slug,
        categoriesList: categoriesFilter,
        skip: i,
        limit: limit,
      }
    })
  }
}

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Get all markdown blog posts sorted by date
  const result = await graphql(`
    {
      allMdx(sort: { frontmatter: { date: ASC } }, limit: 1000) {
        nodes {
          id
          fields {
            slug
          }
          frontmatter {
            title
            date
            description
            category
            layout
            index
          }
          internal {
            contentFilePath
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const posts = result.data.allMdx.nodes

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  if (posts.length > 0) {
    // aggregate posts by categories
    const postsByCategory = posts.reduce((total, value) => {
      const category = value.frontmatter.category || siteConfig.categoryNameForAll
      if(total[category] === undefined) {
        total[category] = []
      }
      total[category].push(value)
      return total
    }, {})
    const categoriesList = Object.keys(postsByCategory)
    categoriesList.forEach((key) => {
      const post = postsByCategory[key].find((value) => {
        return value.frontmatter.index == true
      })
      if(post === undefined){
        return
      }
      const postCount = postsByCategory[key].length
      createIndexPage({ actions, post, postCount , categoriesList })
    })
    
    // page for each posts
    posts.filter((post) => {
      return post.frontmatter.index != true
    }).forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].id
      const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id

      // Define the template for blog post
      const layout = post.frontmatter.layout || 'blog-post'
      const template = path.resolve(`./src/templates/${layout}.js`)
      createPage({
        path: post.fields.slug,
        component:`${template}?__contentFilePath=${post.internal.contentFilePath}`,
        // component: post.internal.contentFilePath,
        // component: blogPost,
        context: {
          id: post.id,
          slug: post.fields.slug,
          previousPostId,
          nextPostId,
        },
      })
    })
  }
}

/**
 * @type {import('gatsby').GatsbyNode['onCreateNode']}
 */
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `Mdx`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

/**
 * @type {import('gatsby').GatsbyNode['createSchemaCustomization']}
 */
exports.createSchemaCustomization = ({ actions, schema, getNode, getNodesByType, pathPrefix, reporter, cache, store }) => {
  const { createTypes } = actions

  const headingsResolver = schema.buildObjectType({
    name: `Mdx`,
    fields: {
      headings: {
        type: `[MdxHeading]`,
        async resolve(mdxNode) {
          const fileNode = getNode(mdxNode.parent)

          if (!fileNode) {
            return null
          }

          const result = await compileMDXWithCustomOptions(
            {
              source: mdxNode.body,
              absolutePath: fileNode.absolutePath,
            },
            {
              pluginOptions: {},
              customOptions: {
                mdxOptions: {
                  remarkPlugins: [remarkHeadingsPlugin],
                },
              },
              getNode,
              getNodesByType,
              pathPrefix,
              reporter,
              cache,
              store,
            }
          )

          if (!result) {
            return null
          }

          return result.metadata.headings
        }
      }
    }
  })
  createTypes([
    `
      type MdxHeading {
        value: String
        depth: Int
      }
    `,
    headingsResolver,
  ])

  // Frontmatter resolver
  const frontmatterResolvers = schema.buildObjectType({
    name: "Frontmatter",
    fields: {
      index: {
        type: "Boolean",
        resolve(source, args, context, info) {
          if(source.index == null){
            return false
          }
          return source.index
        },
      },
      category: {
        type: "String",
        resolve(source, args, context, info) {
          const { category } = source
          if(source.category == null ) {
            return siteMetadata.config.categoryNameForAll
          }
          return category
        },
      },
      tags: {
        type: "[String!]",
        resolve(source, args, context, info) {
          // For a more generic solution, you could pick the field value from
          // `source[info.fieldName]`
          const { tags } = source
          if (source.tags == null || (Array.isArray(tags) && !tags.length)) {
            return ["uncategorized"]
          }
          return tags
        },
      },
    },
  })
  createTypes(frontmatterResolvers)

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
      description: String
      config: Config
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
      github: String
    }

    type Config {
      categoryNameForAll: String
      paginationPageSize: Int
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Mdx implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
      layout: String
      index: Boolean
      category: String
      tags: [String]
    }

    type Fields {
      slug: String
    }
  `)
}
