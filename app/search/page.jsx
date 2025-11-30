import Link from 'next/link'
import { parseStringPromise } from 'xml2js'
import SearchInput from '@/components/SearchInput'
import { Suspense } from 'react'

export default async function SearchPage({ searchParams }) {
  const q = (await searchParams).q || ''
  let results = []

  if (q) {
    try {
      const response = await fetch(
        `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(q)}&start=0&max_results=10&sortBy=relevance&sortOrder=descending`,
        { next: { revalidate: 3600 } }
      )
      const data = await response.text()
      const result = await parseStringPromise(data)
      
      if (result.feed?.entry) {
        results = result.feed.entry.map(entry => ({
          id: entry.id?.[0]?.split('/').pop()?.replace('abs/', ''),
          title: entry.title?.[0]?.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim(),
          summary: entry.summary?.[0]?.replace(/\n/g, ' ').trim().substring(0, 200) + '...',
          authors: entry.author?.map(a => a.name?.[0]).join(', '),
          published: new Date(entry.published?.[0]).toLocaleDateString(),
          category: entry['arxiv:primary_category']?.[0]?.$?.term
        }))
      }
    } catch (error) {
      // Silent error handling for search
    }
  }

  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-6 text-3xl font-bold text-white">Search Articles</h1>
        <Suspense fallback={<div className="h-12 w-full max-w-2xl rounded-full bg-gray-900"></div>}>
          <SearchInput />
        </Suspense>
      </div>

      <div className="space-y-4">
        {q && results.length === 0 && (
          <p className="text-gray-400">No results found for "{q}".</p>
        )}
        
        {!q && (
          <p className="text-gray-400">Enter a search term to find articles.</p>
        )}

        {results.map((article) => (
          <Link key={article.id} href={`/articles/${article.id}`} className="block rounded-xl border border-gray-800 bg-gray-900 p-6 transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/10">
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded-full bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-400">{article.category}</span>
              <span className="text-xs text-gray-500">{article.published}</span>
            </div>
            <h2 className="mb-2 text-xl font-bold text-white hover:text-blue-400">{article.title}</h2>
            <p className="mb-3 text-sm text-gray-400 line-clamp-2">{article.authors}</p>
            <p className="text-sm text-gray-500">{article.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}