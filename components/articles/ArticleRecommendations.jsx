'use client'

import React from 'react'
import Link from 'next/link'
import LatexText from './LatexText'

const ArticleRecommendations = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) {
    return null
  }

  return (
    <div className="mt-8 mb-8">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-200 uppercase tracking-wide">
          Recommended Articles
        </h2>
        
        <div className="space-y-4">
          {recommendations.map((article, index) => (
            <Link 
              key={index}
              href={`/articles/${article.id}`}
              className="block p-4 bg-gray-850 border border-gray-800 rounded-lg hover:border-blue-500 hover:bg-gray-800 transition-all group"
            >
              <h3 className="text-gray-200 font-medium mb-2 group-hover:text-blue-400 transition-colors leading-relaxed">
                <LatexText text={article.title} />
              </h3>
              
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                <span className="uppercase tracking-wide text-xs text-gray-500">
                  Authors
                </span>
                <span className="text-gray-400">
                  {article.authors.slice(0, 3).join(', ')}{article.authors.length > 3 ? ', et al.' : ''}
                </span>
              </div>
              
              {article.summary && (
                <p className="text-sm text-gray-400 line-clamp-3 mt-2 leading-relaxed">
                  <LatexText text={article.summary} />
                </p>
              )}
              
              <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                <span className="uppercase tracking-wide">Published</span>
                <span>{new Date(article.published).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ArticleRecommendations
