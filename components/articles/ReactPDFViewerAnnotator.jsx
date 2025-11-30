'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { saveAnnotation, getAnnotations, deleteAnnotation } from '@/lib/firestore'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { highlightPlugin } from '@react-pdf-viewer/highlight'
import Link from 'next/link'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/highlight/lib/styles/index.css'

const ReactPDFViewerAnnotator = ({ articleId }) => {
  const { user } = useAuth()
  const [annotations, setAnnotations] = useState([])
  const [selectedText, setSelectedText] = useState('')
  const [comment, setComment] = useState('')
  const [showCommentBox, setShowCommentBox] = useState(false)
  const [currentSelection, setCurrentSelection] = useState(null)
  const [highlightColor, setHighlightColor] = useState('yellow')
  
  const pdfUrl = `/api/proxy-pdf?url=${encodeURIComponent(`https://arxiv.org/pdf/${articleId}.pdf`)}`
  
  const highlightColors = {
    yellow: { bg: 'rgba(255, 255, 0, 0.4)', border: 'border-yellow-500', name: 'Yellow' },
    green: { bg: 'rgba(74, 222, 128, 0.4)', border: 'border-green-500', name: 'Green' },
    blue: { bg: 'rgba(96, 165, 250, 0.4)', border: 'border-blue-400', name: 'Blue' },
    pink: { bg: 'rgba(244, 114, 182, 0.4)', border: 'border-pink-500', name: 'Pink' },
  }
  
  const userColors = [
    'text-blue-400',
    'text-green-400',
    'text-yellow-400',
    'text-pink-400',
    'text-purple-400',
    'text-cyan-400',
    'text-orange-400',
    'text-teal-400',
  ]
  
  const getUserColor = (userId) => {
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return userColors[hash % userColors.length]
  }
  
  const getUserName = (annotation) => {
    if (annotation.userId === user?.uid) return 'You'
    if (annotation.userName) return annotation.userName
    const userId = annotation.userId
    if (!userId) return 'Anonymous'
    return `User ${userId.slice(0, 6)}`
  }

  const highlightPluginInstance = highlightPlugin({
    renderHighlights: (props) => (
      <div>
        {annotations.map((annotation, idx) => {
          if (annotation.highlightAreas && annotation.pageNumber === props.pageIndex + 1) {
            const color = annotation.highlightColor || 'yellow'
            const bgColor = highlightColors[color]?.bg || highlightColors.yellow.bg
            return annotation.highlightAreas.map((area, areaIdx) => (
              <div
                key={`${idx}-${areaIdx}`}
                className="custom-highlight"
                style={{
                  background: bgColor,
                  left: `${area.left}%`,
                  top: `${area.top}%`,
                  height: `${area.height}%`,
                  width: `${area.width}%`,
                  position: 'absolute',
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  zIndex: 1,
                }}
                title={annotation.comment || 'Click to see comment'}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  const commentElement = document.getElementById(`comment-${idx}`)
                  if (commentElement) {
                    commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    commentElement.classList.add('ring-2', 'ring-blue-500')
                    setTimeout(() => {
                      commentElement.classList.remove('ring-2', 'ring-blue-500')
                    }, 2000)
                  }
                }}
                onMouseDown={(e) => {
                  if (e.detail === 1) {
                    e.currentTarget.dataset.clickStart = Date.now()
                  }
                }}
                onMouseUp={(e) => {
                  const clickStart = e.currentTarget.dataset.clickStart
                  if (clickStart && Date.now() - clickStart < 200) {
                    e.currentTarget.click()
                  }
                }}
              />
            ))
          }
          return null
        })}
      </div>
    ),
  })

  const { jumpToHighlightArea } = highlightPluginInstance

  useEffect(() => {
    if (articleId) fetchAnnotationsData()
  }, [articleId])

  const fetchAnnotationsData = async () => {
    try {
      const result = await getAnnotations(articleId)
      if (result.success) setAnnotations(result.annotations)
    } catch (error) {
      
    }
  }

  const handleTextSelection = () => {
    const selection = window.getSelection()
    const text = selection.toString().trim()
    
    if (text && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const rects = range.getClientRects()
      
      if (rects.length > 0) {
        const viewerContainer = document.querySelector('.rpv-core__inner-page')
        if (viewerContainer) {
          const containerRect = viewerContainer.getBoundingClientRect()
          const pageHeight = containerRect.height
          const pageWidth = containerRect.width
          
          const highlightAreas = Array.from(rects).map(rect => ({
            left: ((rect.left - containerRect.left) / pageWidth) * 100,
            top: ((rect.top - containerRect.top) / pageHeight) * 100,
            height: (rect.height / pageHeight) * 100,
            width: (rect.width / pageWidth) * 100,
          }))
          
          setCurrentSelection({
            text,
            highlightAreas,
            pageNumber: 1
          })
        }
      }
      
      setSelectedText(text)
      setShowCommentBox(true)
      
      setTimeout(() => {
        const commentForm = document.getElementById('comment-form')
        if (commentForm) {
          commentForm.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }

  const handleSaveAnnotation = async () => {
    if (!selectedText || !user) {
      alert('Please make sure you are logged in and have selected text')
      return
    }
    
    try {
      const annotationData = {
        articleId,
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        pageNumber: currentSelection?.pageNumber || 1,
        highlightedText: selectedText,
        comment,
        timestamp: new Date().toISOString(),
        highlightAreas: currentSelection?.highlightAreas || [],
        highlightColor: highlightColor
      }
      
      const result = await saveAnnotation(annotationData)
      
      if (result.success) {
        setAnnotations([{ ...result, ...annotationData }, ...annotations])
        setComment('')
        setSelectedText('')
        setCurrentSelection(null)
        setShowCommentBox(false)
      } else {
        alert(`Error: ${result.error || 'Failed to save annotation'}`)
      }
    } catch (error) {
      alert(`Error saving: ${error.message}`)
    }
  }
  
  const handleDeleteAnnotation = async (annotationId, index) => {
    if (!annotationId) {
      setAnnotations(annotations.filter((_, i) => i !== index))
      return
    }
    
    try {
      const result = await deleteAnnotation(annotationId)
      
      if (result.success) {
        setAnnotations(annotations.filter((_, i) => i !== index))
      } else {
        alert(`Error deleting: ${result.error || 'Failed to delete annotation'}`)
      }
    } catch (error) {
      alert(`Error deleting: ${error.message}`)
    }
  }

  return (
    <div className="my-8">
      <h2 className="text-xl font-semibold mb-4 text-white">PDF Annotator</h2>
      
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3">
          <div 
            onMouseUp={handleTextSelection}
            className="border border-gray-700 rounded-lg bg-white"
            style={{ height: '800px', overflow: 'auto' }}
          >
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer 
                fileUrl={pdfUrl}
                plugins={[highlightPluginInstance]}
              />
            </Worker>
          </div>
        </div>

        <div className="col-span-1">
          <div className="sticky top-4 border border-gray-800 p-4 rounded-lg bg-gray-900 max-h-screen overflow-y-auto">
            
            <div className="mb-4 p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm">
              <p className="font-semibold mb-2 text-gray-200">How to Annotate</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-400">
                <li>Select text in the PDF</li>
                <li>Click "Add Comment"</li>
                <li>Add your comment</li>
                <li>Click Save</li>
              </ol>
            </div>

            {!showCommentBox && (
              user ? (
                <button
                  onClick={() => setShowCommentBox(true)}
                  className="w-full mb-4 px-4 py-2.5 bg-blue-600 text-white border border-blue-500 rounded-lg font-medium hover:bg-blue-700 hover:border-blue-600 transition"
                >
                  Add Comment
                </button>
              ) : (
                <div className="mb-4 p-4 bg-gray-800 border border-gray-700 rounded-lg text-center">
                  <p className="text-sm text-gray-400 mb-3">Log in to add annotations</p>
                  <Link 
                    href="/login" 
                    className="inline-block w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Log In
                  </Link>
                </div>
              )
            )}

            {showCommentBox && (
              <div id="comment-form" className="mb-4 p-4 bg-gray-800 border border-gray-700 rounded-lg">
                <h4 className="font-semibold mb-3 text-gray-200">New Annotation</h4>
                
                {!user && (
                  <div className="mb-3 p-2 bg-yellow-900/30 border border-yellow-800 rounded text-xs text-yellow-200">
                    You must be logged in to save annotations.
                  </div>
                )}
                
                <label className="block text-xs font-medium mb-1.5 text-gray-400 uppercase tracking-wide">
                  Highlighter Color
                </label>
                <div className="flex gap-2 mb-3">
                  {Object.entries(highlightColors).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setHighlightColor(key)}
                      className={`flex-1 py-2 px-3 rounded border-2 transition-all ${
                        highlightColor === key 
                          ? `${value.border} bg-gray-700` 
                          : 'border-gray-700 bg-gray-850 hover:bg-gray-750'
                      }`}
                      title={value.name}
                    >
                      <div 
                        className="w-full h-4 rounded"
                        style={{ backgroundColor: value.bg.replace('0.4', '0.8') }}
                      />
                    </button>
                  ))}
                </div>
                
                <label className="block text-xs font-medium mb-1.5 text-gray-400 uppercase tracking-wide">
                  Selected Text
                </label>
                <textarea
                  value={selectedText}
                  onChange={(e) => setSelectedText(e.target.value)}
                  placeholder="Select text from PDF or paste here..."
                  className="w-full p-2.5 bg-gray-850 border border-gray-700 rounded text-sm text-gray-200 placeholder-gray-500 mb-3 focus:border-gray-600 focus:outline-none"
                  rows={3}
                />
                
                <label className="block text-xs font-medium mb-1.5 text-gray-400 uppercase tracking-wide">
                  Your Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add your comment or note..."
                  className="w-full p-2.5 bg-gray-850 border border-gray-700 rounded text-sm text-gray-200 placeholder-gray-500 mb-3 focus:border-gray-600 focus:outline-none"
                  rows={3}
                />
                
                <div className="flex gap-2">
                  <button 
                    onClick={handleSaveAnnotation} 
                    disabled={!user}
                    className={`flex-1 px-4 py-2 rounded font-medium transition ${
                      user 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => {
                      setShowCommentBox(false)
                      setSelectedText('')
                      setComment('')
                    }} 
                    className="px-4 py-2 bg-gray-800 text-gray-400 border border-gray-700 rounded hover:bg-gray-750 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            <div className="border-t border-gray-800 pt-4">
              <h3 className="font-semibold text-base mb-3 flex items-center justify-between text-gray-200">
                <span>Comments</span>
                <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded border border-gray-700">
                  {annotations.length}
                </span>
              </h3>
              
              {annotations.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-6">
                  No annotations yet. Start by selecting text!
                </p>
              ) : (
                <div className="space-y-3">
                  {annotations.map((a, i) => {
                    const userColor = getUserColor(a.userId || 'anonymous')
                    const userName = getUserName(a)
                    const highlightBorderColor = highlightColors[a.highlightColor || 'yellow']?.border || 'border-yellow-500'
                    
                    return (
                      <div 
                        key={i} 
                        id={`comment-${i}`}
                        className={`p-3 bg-gray-850 border ${highlightBorderColor} rounded-lg transition-all`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className={`text-sm font-semibold ${userColor}`}>{userName}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Page {a.pageNumber}</span>
                            <button
                              onClick={() => handleDeleteAnnotation(a.id, i)}
                              className="text-gray-500 hover:text-red-400 transition-colors p-1"
                              title="Delete annotation"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 mb-2 p-2 bg-gray-800 rounded border-l-2 border-gray-700">
                          "{a.highlightedText}"
                        </p>
                        {a.comment && (
                          <p className="text-sm text-gray-300 bg-gray-800 p-2 rounded">
                            {a.comment}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReactPDFViewerAnnotator
