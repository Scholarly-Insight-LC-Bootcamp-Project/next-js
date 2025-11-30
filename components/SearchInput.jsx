'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function SearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentUrlQuery = searchParams.get('q') || ''
      if (query !== currentUrlQuery) {
        const params = new URLSearchParams(searchParams)
        if (query) {
          params.set('q', query)
        } else {
          params.delete('q')
        }
        router.replace(`/search?${params.toString()}`)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query, router, searchParams])

  return (
    <div className="relative flex max-w-2xl items-center">
      <Search className="absolute left-4 text-gray-500" size={20} />
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for papers..." 
        className="w-full rounded-lg border border-gray-700 bg-gray-950 pl-10 pr-4 py-2 text-white focus:border-blue-500 focus:outline-none"
      />
    </div>
  )
}