'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { saveAnnotation, getAnnotations } from '@/lib/firestore'

const GoogleDocsAnnotator = ({ articleId }) => {
  const { user, signInAsGuest } = useAuth()
  const [annotations, setAnnotations] = useState([])
  const [selectedText, setSelectedText] = useState('')
  const [comment, setComment] = useState('')
  const [showCommentBox, setShowCommentBox] = useState(false)
  
  const pdfUrl = `https://arxiv.org/pdf/${articleId}.pdf`
  
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
  
  const handleTextSelection = () => {
    const selection = window.getSelection()
    const text = selection.toString().trim()
    if (text) {
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
        pageNumber: 1,
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
      } else {
        alert(`Error: ${result.error || 'Failed to save annotation'}`)
      }
    } catch (error) {
      console.error('Save error:', error)
      alert(`Error saving: ${error.message}`)
    }
  }
  
  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">📄 PDF Viewer & Annotations</h2>
      
      <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 mb-4">
        <p className="font-bold text-yellow-900 mb-2">📝 How to Add Annotations:</p>
        <ol className="text-sm text-yellow-900 space-y-1 ml-5 list-decimal">
          <li><strong>Select text</strong> in the PDF viewer below (using your mouse)</li>
          <li><strong>Copy it</strong> (Ctrl+C or right-click → Copy)</li>
          <li><strong>Click "Add Comment"</strong> button on the right →</li>
          <li><strong>Paste the text</strong> and add your comment</li>
          <li><strong>Click Save</strong></li>
        </ol>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
            <embed src={pdfUrl} type="application/pdf" width="100%" height="900px" />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="border-2 border-gray-300 rounded-lg p-4 bg-white shadow-lg sticky top-4">
            {!showCommentBox && (
              <button
                onClick={() => setShowCommentBox(true)}
                className="w-full mb-4 px-4 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow"
              >
                ➕ Add Comment
              </button>
            )}
            
            {showCommentBox && (
              <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-400 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-bold text-gray-800">💬 New Comment</p>
                  <button 
                    onClick={() => {
                      setShowCommentBox(false)
                      setSelectedText('')
                      setComment('')
                    }}
                    className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                  >
                    ×
                  </button>
                </div>
                
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Selected text (paste here):
                </label>
                <textarea
                  value={selectedText}
                  onChange={(e) => setSelectedText(e.target.value)}
                  placeholder="Paste the text you selected from the PDF..."
                  className="w-full p-2 border-2 border-gray-300 rounded text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Your comment:
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Type your comment here..."
                  className="w-full p-2 border-2 border-gray-300 rounded text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {annotations.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-3xl mb-2">📝</p>
                    <p className="text-sm text-gray-500">No comments yet</p>
                  </div>
                ) : (
                  annotations.map((a, i) => (
                    <div key={i} className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 rounded-r-lg shadow-sm">
                      <p className="text-xs text-gray-500 font-semibold mb-1">Selected text:</p>
                      <p className="text-sm italic text-gray-700 mb-2 pl-2 border-l-2 border-blue-400">
                        "{a.highlightedText}"
                      </p>
                      {a.comment && (
                        <div className="mt-2 p-2 bg-white rounded shadow-sm">
                          <p className="text-xs text-gray-500 font-semibold mb-1">Comment:</p>
                          <p className="text-sm text-gray-800">{a.comment}</p>
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(a.createdAt || a.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoogleDocsAnnotator
