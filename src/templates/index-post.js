import * as React from "react"
import { Link, graphql, navigate } from "gatsby"

import { Pagination } from "@mui/material"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import NavigationPanel from "../components/navigation"

const IndexPostTemplate = ({
  data: {
    site,
    categories,
    post,
    posts,
  },
  children,
  location,
}) => {
  const siteTitle = site.siteMetadata?.title || `Title`
  const navigationLinks = categories.nodes.map((value) => {
    let category = value.frontmatter.category
    if(category === site.siteMetadata.config.categoryNameForAll) {
      category = ""
    }
    let linkPath = `/${category}/`
    if(category === "") {
      linkPath = "/"
    }
    return {
      title: value.frontmatter.title,
      link: linkPath
    }
  })
  const handlePageChange = (event, page) => {
    let category = post.frontmatter.category
    if(category === site.siteMetadata.config.categoryNameForAll) {
      category = ""
    }
    if(page === 1) {
      navigate(`/${category}`)
    } else if(category === "") {
      navigate(`/index-page/${page}`)
    } else {
      navigate(`/${category}/index-page/${page}`)
    }
  }
  return (
    <div>
      <NavigationPanel 
        location={location}
        navigationLinks={navigationLinks}>{siteTitle}</NavigationPanel>
      <Layout location={location} title={siteTitle}>
        <Bio />
        <article
          className="blog-post"
          itemScope
          itemType="http://schema.org/Article"
        >
          <header>
            <h1 itemProp="headline">{post.frontmatter.title}</h1>
          </header>
          {children}
          <hr />
          <ol style={{ listStyle: `none` }}>
            {posts.nodes.map(post => {
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
          <Pagination 
            page={posts.pageInfo.currentPage} 
            hidePrevButton={!posts.pageInfo.hasPreviousPage}
            hideNextButton={!posts.pageInfo.hasNextPage} 
            count={posts.pageInfo.pageCount} 
            onChange={handlePageChange}/>
        </article>
      </Layout>
    </div>
  )
}

export const Head = ({ data: { post } }) => {
  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
    />
  )
}

export default IndexPostTemplate

export const pageQuery = graphql`
  query BlogPostByCategory(
    $id: String!
    $slug: String!
    $categoriesList: [String]
    $skip: Int
    $limit: Int
  ) {
    site {
      siteMetadata {
        title
        config {
          categoryNameForAll
        }
      }
    }
    categories: allMdx(
      filter: {
        frontmatter: {
          index: {
            eq: true
          }
        }
      }
    ) {
      nodes {
        frontmatter {
          title
          category
        }
      }
    }
    post: mdx(
      id: {
        eq: $id
      }
    ) {
      id
      excerpt(pruneLength: 160)
      fields {
        slug
      }
      frontmatter {
        title
        category
        tags
        description
      }
    }
    posts: allMdx(
      filter: {
        fields: { 
          slug: { 
            ne: $slug
          } 
        }
        frontmatter: {
          index: {
            ne: true
          }
          category: {
            in: $categoriesList
          }
        }
      }
      skip: $skip
      limit: $limit
    ) {
      nodes {
        id
        excerpt(pruneLength: 160)
        fields {
          slug
        }
        frontmatter {
          title
          date(formatString: "DD-MMM-YYYY")
          description
        }
      }
      pageInfo {
        currentPage
        hasNextPage
        hasPreviousPage
        itemCount
        pageCount
        perPage
        totalCount
      }
    }
  }
`
