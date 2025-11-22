import React from 'react'
import LatexText from './LatexText'

const ArticleHeader = ({ title, authors, published }) => {
  return (
    <div className="mb-8 pb-6 border-b border-gray-800">
      <h1 className="text-4xl font-bold mb-4 text-white">
        <LatexText text={title} />
      </h1>
      
      {authors && authors.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Authors</p>
          <p className="text-gray-300">{authors.join(', ')}</p>
        </div>
      )}
      
      {published && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Published</p>
          <p className="text-gray-300">{new Date(published).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  )
}

export default ArticleHeader
