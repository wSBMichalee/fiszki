import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Fiszki - Ucz się skuteczniej',
  description: 'Porady, techniki nauki i aktualności ze świata efektywnego przyswajania wiedzy.',
}

export default async function BlogIndexPage() {
  const posts = await getAllPosts()

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] items-center px-4 py-16 sm:px-6">
      <div className="w-full max-w-4xl flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[var(--color-navy)] mb-4 text-center">
          Blog
        </h1>
        <p className="text-lg text-[var(--color-graphite)] mb-12 text-center max-w-2xl">
          Porady, techniki nauki i sekrety efektywnego zapamiętywania. Dowiedz się, jak uczyć się mądrzej, a nie dłużej.
        </p>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug} className="group flex flex-col bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200">
              <time className="text-xs font-bold text-[var(--color-gold)] uppercase tracking-widest mb-3">
                {new Date(post.frontmatter.date).toLocaleDateString('pl-PL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              
              <h2 className="text-2xl font-serif font-bold text-[var(--color-navy)] mb-3 group-hover:text-[var(--color-gold)] transition-colors leading-snug">
                {post.frontmatter.title}
              </h2>
              
              <p className="text-[var(--color-graphite)] text-sm mb-6 flex-1 line-clamp-3">
                {post.frontmatter.description}
              </p>
              
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-navy)] group-hover:text-[var(--color-gold)] transition-colors mt-auto">
                Czytaj dalej <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
          
          {posts.length === 0 && (
            <div className="col-span-full py-20 text-center text-[var(--color-graphite)]">
              Brak artykułów do wyświetlenia. Wróć tu wkrótce!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
