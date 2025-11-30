'use client'
import Link from 'next/link'
import { Search, User, Menu, X, Settings, LogOut, Bookmark } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { useBookmarks } from '@/components/context/BookmarksContext'
import { useRouter } from 'next/navigation'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false)
  const { user, signOut } = useAuth()
  const { bookmarks } = useBookmarks()
  const router = useRouter()
  const [greeting, setGreeting] = useState('Good morning')
  const bookmarksRef = useRef(null)

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bookmarksRef.current && !bookmarksRef.current.contains(event.target)) {
        setIsBookmarksOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    setIsMenuOpen(false)
  }

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-500">
          <span className="text-white">Scholarly</span>Insight
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/search" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Search
          </Link>
          <Link href="/about-us" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            About Us
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <span className="text-sm text-gray-300">
                {greeting}, <span className="font-semibold text-white">{displayName}</span>
              </span>
              <div className="flex items-center gap-4 border-l border-gray-700 pl-6 h-8">
                <div className="relative" ref={bookmarksRef}>
                  <button 
                    onClick={() => setIsBookmarksOpen(!isBookmarksOpen)}
                    className={`transition-colors ${isBookmarksOpen ? 'text-blue-500' : 'text-gray-400 hover:text-white'}`}
                    title="Bookmarks"
                  >
                    <Bookmark size={20} />
                  </button>
                  
                  {isBookmarksOpen && (
                    <div className="absolute right-0 mt-2 w-80 rounded-xl border border-gray-800 bg-gray-900 p-2 shadow-xl">
                      <div className="mb-2 px-3 py-2 text-xs font-semibold uppercase text-gray-500">
                        Saved Articles
                      </div>
                      <div className="flex flex-col gap-1 max-h-64 overflow-y-auto custom-scrollbar">
                        {bookmarks.length === 0 ? (
                          <div className="px-3 py-4 text-center text-sm text-gray-500">
                            No bookmarks yet
                          </div>
                        ) : (
                          bookmarks.map((item) => (
                            <Link 
                              key={item.id}
                              href={`/articles/${item.id}`}
                              className="block rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                              onClick={() => setIsBookmarksOpen(false)}
                            >
                              <div className="truncate font-medium">{item.title}</div>
                              <div className="text-xs text-gray-500">arXiv:{item.id}</div>
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <Link href="/settings" className="text-gray-400 hover:text-white transition-colors" title="Settings">
                  <Settings size={20} />
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="text-gray-400 hover:text-red-400 transition-colors" 
                  title="Sign out"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Log in
              </Link>
              <Link href="/register" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                Sign up
              </Link>
            </>
          )}
        </div>

        <button 
          className="md:hidden text-gray-300 hover:text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-950 px-4 py-4">
          <nav className="flex flex-col gap-4">
            <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link href="/search" className="text-sm font-medium text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>
              Search
            </Link>
            <Link href="/about-us" className="text-sm font-medium text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>
              About Us
            </Link>
            
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-800">
              {user ? (
                <>
                  <div className="text-sm text-gray-300 mb-2">
                    {greeting}, <span className="font-semibold text-white">{displayName}</span>
                  </div>
                  <Link href="#" className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>
                    <Bookmark size={16} /> Bookmarks
                  </Link>
                  <Link href="/settings" className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>
                    <Settings size={16} /> Settings
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 text-left"
                  >
                    <LogOut size={16} /> Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>
                    Log in
                  </Link>
                  <Link href="/register" className="text-sm font-medium text-blue-500 hover:text-blue-400" onClick={() => setIsMenuOpen(false)}>
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header