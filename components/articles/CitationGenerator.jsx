'use client'

import React, { useState } from 'react'

const CitationGenerator = ({ title, authors, published, articleId }) => {
  const [copiedFormat, setCopiedFormat] = useState(null)
  const [selectedFormat, setSelectedFormat] = useState('APA')
  const [isOpen, setIsOpen] = useState(false)
  
  const pubDate = published ? new Date(published) : new Date()
  const year = pubDate.getFullYear()
  const month = pubDate.toLocaleString('default', { month: 'long' })
  const day = pubDate.getDate()
  
  const formatAuthorsAPA = () => {
    if (!authors || authors.length === 0) return 'Unknown Author'
    if (authors.length === 1) return authors[0]
    if (authors.length === 2) return `${authors[0]} & ${authors[1]}`
    
    const lastAuthor = authors[authors.length - 1]
    const otherAuthors = authors.slice(0, -1).join(', ')
    return `${otherAuthors}, & ${lastAuthor}`
  }
  
  const formatAuthorsMLA = () => {
    if (!authors || authors.length === 0) return 'Unknown Author'
    if (authors.length === 1) return authors[0]
    if (authors.length === 2) return `${authors[0]} and ${authors[1]}`
    return `${authors[0]}, et al.`
  }
  
  const formatAuthorsChicago = () => {
    if (!authors || authors.length === 0) return 'Unknown Author'
    if (authors.length === 1) return authors[0]
    if (authors.length === 2) return `${authors[0]} and ${authors[1]}`
    
    const lastAuthor = authors[authors.length - 1]
    const otherAuthors = authors.slice(0, -1).join(', ')
    return `${otherAuthors}, and ${lastAuthor}`
  }
  
  const formatAuthorsBibTeX = () => {
    if (!authors || authors.length === 0) return 'Unknown Author'
    return authors.join(' and ')
  }
  
  const citations = {
    APA: `${formatAuthorsAPA()} (${year}). ${title}. arXiv preprint arXiv:${articleId}. https://arxiv.org/abs/${articleId}`,
    
    MLA: `${formatAuthorsMLA()}. "${title}." arXiv preprint arXiv:${articleId} (${year}). Web. ${day} ${month} ${year}.`,
    
    Chicago: `${formatAuthorsChicago()}. "${title}." arXiv preprint arXiv:${articleId} (${year}). https://arxiv.org/abs/${articleId}.`,
    
    BibTeX: `@article{${articleId.replace(/\./g, '_')},
  title={${title}},
  author={${formatAuthorsBibTeX()}},
  journal={arXiv preprint arXiv:${articleId}},
  year={${year}},
  url={https://arxiv.org/abs/${articleId}}
}`
  }
  
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedFormat(selectedFormat)
      setTimeout(() => setCopiedFormat(null), 2000)
    } catch (err) {
      alert('Failed to copy to clipboard')
    }
  }
  
  return (
    <div className="my-8 p-6 bg-gray-900 border border-gray-800 rounded-lg">
      <h2 className="text-xl font-semibold mb-2 text-white">
        Citation Generator
      </h2>
      
      <p className="text-sm text-gray-500 mb-6">
        Select a citation format and copy it to your clipboard
      </p>
      
      <div className="space-y-4">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-left flex items-center justify-between hover:border-gray-600 hover:bg-gray-750 transition-colors cursor-pointer"
          >
            <span className="text-gray-200 text-sm font-medium">{selectedFormat}</span>
            <svg 
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isOpen && (
            <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              {Object.keys(citations).map((format) => (
                <button
                  key={format}
                  onClick={() => {
                    setSelectedFormat(format)
                    setIsOpen(false)
                  }}
                  className={`w-full px-4 py-2.5 text-sm text-left hover:bg-gray-700 transition-colors cursor-pointer ${
                    selectedFormat === format ? 'bg-gray-750 text-white' : 'text-gray-300'
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="border border-gray-800 rounded-lg overflow-hidden bg-gray-850">
          <div className="p-4">
            <p className="text-sm text-gray-400 font-mono leading-relaxed whitespace-pre-wrap break-words">
              {citations[selectedFormat]}
            </p>
          </div>
          
          <div className="px-4 pb-4">
            <button
              onClick={() => copyToClipboard(citations[selectedFormat])}
              className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                copiedFormat === selectedFormat
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-blue-600 text-white border border-blue-500 hover:bg-blue-700 hover:border-blue-600'
              }`}
            >
              {copiedFormat === selectedFormat ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied to Clipboard
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Citation
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-850 border border-gray-800 rounded-lg">
        <p className="text-sm text-gray-500">
          <strong className="text-gray-400">Note:</strong> These citations follow standard academic formats. 
          Always verify citation requirements with your institution or publisher.
        </p>
      </div>
    </div>
  )
}

export default CitationGenerator
