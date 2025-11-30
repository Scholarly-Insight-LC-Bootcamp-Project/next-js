'use client'

import { useState, useEffect } from 'react'
import { Bookmark } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { useBookmarks } from '@/components/context/BookmarksContext'

export default function BookmarkButton({ articleId, title }) {
  const { user } = useAuth()
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks()
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    setBookmarked(isBookmarked(articleId))
  }, [articleId, isBookmarked])

  const toggleBookmark = () => {
    if (!user) return
    
    if (bookmarked) {
      removeBookmark(articleId)
    } else {
      addBookmark({ id: articleId, title })
    }
  }

  if (!user) return null

  return (
    <button
      onClick={toggleBookmark}
      className="absolute right-0 top-0 p-2 transition-transform hover:scale-110"
      title={bookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
    >
      <Bookmark 
        size={32} 
        className={`${bookmarked ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`} 
      />
    </button>
  )
}