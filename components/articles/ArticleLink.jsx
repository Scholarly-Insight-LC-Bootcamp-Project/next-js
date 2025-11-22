import React from 'react'

const ArticleLink = ({ articleId }) => {
  return (
    <div className="mt-6 mb-8">
      <a 
        href={`https://arxiv.org/pdf/${articleId}.pdf`}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg border border-blue-500 hover:border-blue-600 hover:bg-blue-700 transition-all"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>Download PDF</span>
      </a>
      
      <div className="mt-2">
        <a 
          href={`https://arxiv.org/abs/${articleId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
        >
          <span>View on arXiv</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  )
}

export default ArticleLink
