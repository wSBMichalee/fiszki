import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDir = path.join(process.cwd(), 'content/blog')

export type BlogPostFrontmatter = {
  title: string
  description: string
  date: string
  slug: string
  coverImage?: string
}

export type BlogPost = {
  slug: string
  frontmatter: BlogPostFrontmatter
  content: string
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(contentDir, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      frontmatter: {
        ...data,
        slug,
      } as BlogPostFrontmatter,
      content,
    }
  } catch (error) {
    return null
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    if (!fs.existsSync(contentDir)) {
      return []
    }
    
    const fileNames = fs.readdirSync(contentDir)
    
    const posts = await Promise.all(
      fileNames
        .filter(fileName => fileName.endsWith('.mdx'))
        .map(async (fileName) => {
          const slug = fileName.replace(/\.mdx$/, '')
          return await getPostBySlug(slug)
        })
    )

    return posts
      .filter((post): post is BlogPost => post !== null)
      .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1))
  } catch (error) {
    console.error('Error reading blog posts:', error)
    return []
  }
}
