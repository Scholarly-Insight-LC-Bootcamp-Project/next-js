import React from 'react'
import LatexText from './LatexText'

const ArticleAbstract = ({ summary }) => {
  if (!summary) return null
  
  return (
    <div className="mb-8">
      <h2 className="text-sm text-gray-500 uppercase tracking-wider mb-3">Abstract</h2>
      <div className="text-gray-300 leading-relaxed text-justify">
        <LatexText text={summary} />
      </div>
    </div>
  )
}

export default ArticleAbstract
