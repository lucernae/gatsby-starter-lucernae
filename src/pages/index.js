import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import NavigationPanel from "../components/navigation"
// import { rhythm } from "../utils/typography"
import "katex/dist/katex.min.css"

const BlogIndex = ({ data, location, category }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  let posts = data.allMdx.nodes
  const navigationLinks = data.site.siteMetadata?.navigationLinks || [{
    title: "All",
    link: "/"
  }]

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Bio />
        <p>
          No blog posts found. Add markdown posts to "content" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <div>
      <NavigationPanel navigationLinks={navigationLinks}>
        {siteTitle}
      </NavigationPanel>
      <Layout location={location} title={siteTitle}>
        <Bio />
        <ol style={{ listStyle: `none` }}>
          {posts.map(post => {
            const title = post.frontmatter.title || post.fields.slug

            return (
              <li key={post.fields.slug}>
                <article
                  className="post-list-item"
                  itemScope
                  itemType="http://schema.org/Article"
                >
                  <header>
                    <h2>
                      <Link to={post.fields.slug} itemProp="url">
                        <span itemProp="headline">{title}</span>
                      </Link>
                    </h2>
                    <small>{post.frontmatter.date}</small>
                  </header>
                  <section>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: post.frontmatter.description || post.excerpt,
                      }}
                      itemProp="description"
                    />
                  </section>
                </article>
              </li>
            )
          })}
        </ol>
      </Layout>
    </div>
  )
}

export default BlogIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="All posts" />

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
        navigationLinks {
          link
          title
        }
      }
    }

    allMdx(
      sort: { 
        frontmatter: { 
          date: DESC 
        } 
      }
      limit: 10) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "DD MMMM YYYY")
          title
          description
          category
          tags
        }
      }
    }

    blogs: allMdx(
      filter: {
        frontmatter: {
          category: {
            eq: "blogs"
          }
        }
      }
      sort: { 
        frontmatter: { 
          date: DESC 
        } 
      }
      limit: 10) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "DD MMMM YYYY")
          title
          description
          category
          tags
        }
      }
    }

    softDev: allMdx(
      filter: {
        frontmatter: {
          category: {
            eq: "soft-dev"
          }
        }
      }
      sort: { 
        frontmatter: { 
          date: DESC 
        } 
      }
      limit: 10) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "DD MMMM YYYY")
          title
          description
          category
          tags
        }
      }
    }

    physics: allMdx(
      filter: {
        frontmatter: {
          category: {
            eq: "physics"
          }
        }
      }
      sort: { 
        frontmatter: { 
          date: DESC 
        } 
      }
      limit: 10) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "DD MMMM YYYY")
          title
          description
          category
          tags
        }
      }
    }
  }
`
