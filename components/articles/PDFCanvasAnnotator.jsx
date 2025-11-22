'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { saveAnnotation, getAnnotations } from '@/lib/firestore'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

const PDFCanvasAnnotator = ({ articleId }) => {
  const { user, signInAsGuest } = useAuth()
  const canvasRef = useRef(null)
  const textLayerRef = useRef(null)
  const containerRef = useRef(null)
  
  const [annotations, setAnnotations] = useState([])
  const [selectedText, setSelectedText] = useState('')
  const [comment, setComment] = useState('')
  const [showCommentBox, setShowCommentBox] = useState(false)
  
  const [pdfDoc, setPdfDoc] = useState(null)
  const [pageNum, setPageNum] = useState(1)
  const [pageCount, setPageCount] = useState(0)
  const [scale, setScale] = useState(1.5)
  const [rendering, setRendering] = useState(false)
  
  const pdfUrl = `/api/proxy-pdf?url=${encodeURIComponent(`https://arxiv.org/pdf/${articleId}.pdf`)}`

  useEffect(() => {
    console.log('Current user:', user)
    if (!user) {
      console.log('No user found, signing in as guest...')
      signInAsGuest()
    }
  }, [])

  useEffect(() => {
    if (articleId && user) fetchAnnotations()
  }, [articleId, user])

  const fetchAnnotations = async () => {
    try {
      const result = await getAnnotations(articleId)
      if (result.success) setAnnotations(result.annotations)
    } catch (error) {
      console.error('Error fetching annotations:', error)
    }
  }

  useEffect(() => {
    const loadPDF = async () => {
      try {
        console.log('Loading PDF from:', pdfUrl)
        const loadingTask = pdfjsLib.getDocument(pdfUrl)
        const pdf = await loadingTask.promise
        setPdfDoc(pdf)
        setPageCount(pdf.numPages)
        console.log('PDF loaded successfully, pages:', pdf.numPages)
      } catch (error) {
        console.error('Error loading PDF:', error)
        alert('Failed to load PDF. Please check the console for details.')
      }
    }

    loadPDF()
  }, [pdfUrl])

  useEffect(() => {
    if (pdfDoc) {
      renderPage(pageNum)
    }
  }, [pdfDoc, pageNum, scale])

  const renderPage = async (num) => {
    if (rendering || !pdfDoc) return
    
    setRendering(true)
    
    try {
      const page = await pdfDoc.getPage(num)
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      const viewport = page.getViewport({ scale })
      canvas.height = viewport.height
      canvas.width = viewport.width
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      }
      
      await page.render(renderContext).promise
      
      await renderTextLayer(page, viewport)
      
      drawHighlights(num)
      
      setRendering(false)
    } catch (error) {
      console.error('Error rendering page:', error)
      setRendering(false)
    }
  }

  const renderTextLayer = async (page, viewport) => {
    const textLayer = textLayerRef.current
    if (!textLayer) return
    
    textLayer.innerHTML = ''
    textLayer.style.width = `${viewport.width}px`
    textLayer.style.height = `${viewport.height}px`
    
    const textContent = await page.getTextContent()
    
    textContent.items.forEach((item) => {
      const textDiv = document.createElement('div')
      textDiv.textContent = item.str
      textDiv.style.position = 'absolute'
      textDiv.style.left = `${item.transform[4]}px`
      textDiv.style.top = `${item.transform[5]}px`
      textDiv.style.fontSize = `${Math.sqrt(item.transform[0] * item.transform[0] + item.transform[1] * item.transform[1])}px`
      textDiv.style.fontFamily = item.fontName
      textDiv.style.opacity = '0.2'
      textLayer.appendChild(textDiv)
    })
  }

  const drawHighlights = (currentPage) => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    const pageAnnotations = annotations.filter(a => a.pageNumber === currentPage)
    
    context.fillStyle = 'rgba(255, 255, 0, 0.3)'
    pageAnnotations.forEach(annotation => {
      if (annotation.coordinates) {
        annotation.coordinates.forEach(rect => {
          context.fillRect(rect.x, rect.y, rect.width, rect.height)
        })
      }
    })
  }

  const handleTextSelection = () => {
    const selection = window.getSelection()
    const text = selection.toString().trim()
    
    if (text) {
      console.log('Text selected:', text)
      setSelectedText(text)
      setShowCommentBox(true)
    }
  }

  const handleSaveAnnotation = async () => {
    if (!selectedText || !user) {
      alert('Please make sure you are logged in and have selected text')
      return
    }
    
    console.log('Saving annotation with user:', user.uid)
    
    try {
      const result = await saveAnnotation({
        articleId,
        userId: user.uid,
        pageNumber: pageNum,
        highlightedText: selectedText,
        comment,
        timestamp: new Date().toISOString()
      })
      
      console.log('Save response:', result)
      
      if (result.success) {
        alert('Annotation saved successfully!')
        setAnnotations([result, ...annotations])
        setComment('')
        setSelectedText('')
        setShowCommentBox(false)
        
        renderPage(pageNum)
      } else {
        alert(`Error: ${result.error || 'Failed to save annotation'}`)
      }
    } catch (error) {
      console.error('Save error:', error)
      alert(`Error saving: ${error.message}`)
    }
  }

  const changePage = (offset) => {
    const newPage = pageNum + offset
    if (newPage >= 1 && newPage <= pageCount) {
      setPageNum(newPage)
    }
  }

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">PDF Annotator</h2>
      
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3">
          <div className="mb-4 flex items-center justify-between bg-gray-100 p-3 rounded">
            <div className="flex gap-2">
              <button
                onClick={() => changePage(-1)}
                disabled={pageNum <= 1}
                className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-400"
              >
                Previous
              </button>
              <span className="px-4 py-1">
                Page {pageNum} of {pageCount}
              </span>
              <button
                onClick={() => changePage(1)}
                disabled={pageNum >= pageCount}
                className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-400"
              >
                Next
              </button>
            </div>
            
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setScale(s => Math.max(0.5, s - 0.25))}
                className="px-3 py-1 bg-gray-600 text-white rounded"
              >
                Zoom Out
              </button>
              <span>{Math.round(scale * 100)}%</span>
              <button
                onClick={() => setScale(s => Math.min(3, s + 0.25))}
                className="px-3 py-1 bg-gray-600 text-white rounded"
              >
                Zoom In
              </button>
            </div>
          </div>
          
          <div 
            ref={containerRef}
            className="relative border border-gray-300 overflow-auto bg-gray-50"
            style={{ maxHeight: '800px' }}
          >
            <canvas ref={canvasRef} className="block" />
            <div
              ref={textLayerRef}
              onMouseUp={handleTextSelection}
              className="absolute top-0 left-0 pointer-events-auto"
              style={{ 
                userSelect: 'text',
                cursor: 'text'
              }}
            />
          </div>
        </div>

        <div className="col-span-1">
          <div className="sticky top-4 border p-4 rounded bg-white shadow-lg max-h-screen overflow-y-auto">
            
            <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-sm">
              <p className="font-bold mb-2">📝 How to Annotate:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Select text in the PDF</li>
                <li>Click "Add Comment"</li>
                <li>Add your comment</li>
                <li>Click Save</li>
                <li>Text will be highlighted in yellow!</li>
              </ol>
            </div>

            {!showCommentBox && (
              <button
                onClick={() => setShowCommentBox(true)}
                className="w-full mb-4 px-4 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition shadow"
              >
                ➕ Add Comment
              </button>
            )}

            {showCommentBox && (
              <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                <h4 className="font-bold mb-2 text-blue-900">New Annotation</h4>
                
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Selected Text:
                </label>
                <textarea
                  value={selectedText}
                  onChange={(e) => setSelectedText(e.target.value)}
                  placeholder="Select text from PDF or paste here..."
                  className="w-full p-2 border rounded mb-3 text-sm bg-white"
                  rows={3}
                />
                
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Your Comment:
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add your comment or note..."
                  className="w-full p-2 border rounded mb-3 text-sm bg-white"
                  rows={3}
                />
                
                <div className="flex gap-2">
                  <button 
                    onClick={handleSaveAnnotation} 
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition"
                  >
                    💾 Save
                  </button>
                  <button 
                    onClick={() => {
                      setShowCommentBox(false)
                      setSelectedText('')
                      setComment('')
                    }} 
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="border-t-2 border-gray-200 pt-4">
              <h3 className="font-bold text-lg mb-3 flex items-center justify-between">
                <span>💬 Comments</span>
                <span className="text-sm bg-blue-600 text-white px-2 py-1 rounded-full">
                  {annotations.length}
                </span>
              </h3>
              
              {annotations.length === 0 ? (
                <p className="text-gray-500 text-sm italic text-center py-4">
                  No annotations yet. Start by selecting text!
                </p>
              ) : (
                <div className="space-y-3">
                  {annotations.map((a, i) => (
                    <div key={i} className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 rounded-r-lg shadow-sm">
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-xs font-semibold text-blue-800">Page {a.pageNumber}</span>
                      </div>
                      <p className="text-sm italic text-gray-700 mb-2 bg-yellow-100 p-2 rounded border-l-2 border-yellow-400">
                        "{a.highlightedText}"
                      </p>
                      {a.comment && (
                        <p className="text-sm text-gray-800 bg-white p-2 rounded">
                          💭 {a.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PDFCanvasAnnotator
