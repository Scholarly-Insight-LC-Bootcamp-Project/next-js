'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'

const BookmarksContext = createContext()

export function BookmarksProvider({ children }) {
  const [bookmarks, setBookmarks] = useState([])
  const { user } = useAuth()

  // Load bookmarks from localStorage on mount or user change
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`bookmarks_${user.uid}`)
      if (saved) {
        try {
          setBookmarks(JSON.parse(saved))
        } catch (e) {
          console.error("Failed to parse bookmarks", e)
          setBookmarks([])
        }
      } else {
        setBookmarks([])
      }
    } else {
      setBookmarks([])
    }
  }, [user])

  const addBookmark = (article) => {
    if (!user) return
    
    // Avoid duplicates
    if (bookmarks.some(b => b.id === article.id)) return

    const newBookmarks = [article, ...bookmarks] // Add to top
    setBookmarks(newBookmarks)
    localStorage.setItem(`bookmarks_${user.uid}`, JSON.stringify(newBookmarks))
  }

  const removeBookmark = (articleId) => {
    if (!user) return
    const newBookmarks = bookmarks.filter(b => b.id !== articleId)
    setBookmarks(newBookmarks)
    localStorage.setItem(`bookmarks_${user.uid}`, JSON.stringify(newBookmarks))
  }

  const isBookmarked = (articleId) => {
    return bookmarks.some(b => b.id === articleId)
  }

  return (
    <BookmarksContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}>
      {children}
    </BookmarksContext.Provider>
  )
}

export const useBookmarks = () => useContext(BookmarksContext)
