import Link from 'next/link'
import { Search, BookOpen, Users, PenTool } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-linear-to-b from-gray-900 to-gray-950 py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
            Discover, Annotate, and Share <br />
            <span className="text-blue-500">Academic Research</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-400">
            Scholarly Insight makes it easy to read papers, highlight key insights, and collaborate with peers.
          </p>
          
          <div className="mx-auto max-w-xl">
            <form action="/search" className="relative flex items-center">
              <Search className="absolute left-4 text-gray-500" size={20} />
              <input 
                type="text" 
                name="q"
                placeholder="Search for papers (e.g., 'machine learning', 'quantum computing')..." 
                className="w-full rounded-full border border-gray-700 bg-gray-900 py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button type="submit" className="absolute right-2 rounded-full bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">How It Works</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-900/30 text-blue-500">
                <Search size={32} />
              </div>
              <h3 className="mb-4 text-xl font-bold text-white">Search & Discover</h3>
              <p className="text-gray-400">
                Access millions of articles from arXiv and other open-access repositories directly through our platform.
              </p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-900/30 text-purple-500">
                <PenTool size={32} />
              </div>
              <h3 className="mb-4 text-xl font-bold text-white">Annotate & Highlight</h3>
              <p className="text-gray-400">
                Mark up PDFs with highlights and comments. Save your insights for later review.
              </p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-900/30 text-green-500">
                <Users size={32} />
              </div>
              <h3 className="mb-4 text-xl font-bold text-white">Share & Collaborate</h3>
              <p className="text-gray-400">
                Share your annotated papers with colleagues or students to foster discussion and learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles (Mock) */}
      <section className="w-full bg-gray-900/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">Featured Articles</h2>
            <Link href="/search" className="text-blue-500 hover:text-blue-400">View all</Link>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { id: '2106.09685', title: 'LoRA: Low-Rank Adaptation of Large Language Models', authors: 'Hu et al.', category: 'cs.CL' },
              { id: '1706.03762', title: 'Attention Is All You Need', authors: 'Vaswani et al.', category: 'cs.CL' },
              { id: '2302.13971', title: 'LLaMA: Open and Efficient Foundation Language Models', authors: 'Touvron et al.', category: 'cs.CL' }
            ].map((article) => (
              <Link key={article.id} href={`/articles/${article.id}`} className="group block rounded-xl border border-gray-800 bg-gray-900 p-6 transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/10">
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-400">{article.category}</span>
                  <span className="text-xs text-gray-500">arXiv:{article.id}</span>
                </div>
                <h3 className="mb-2 text-lg font-bold text-white group-hover:text-blue-400">{article.title}</h3>
                <p className="text-sm text-gray-400">{article.authors}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
