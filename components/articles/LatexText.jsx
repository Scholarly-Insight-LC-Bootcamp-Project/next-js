'use client'

import React from 'react'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

const LatexText = ({ text, className = '' }) => {
  if (!text) return null

  const normalizedText = text.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim()

  const displayMathParts = []
  let processedText = normalizedText.replace(/\\\[(.*?)\\\]/g, (match, content, offset) => {
    const placeholder = `__DISPLAYMATH${displayMathParts.length}__`
    displayMathParts.push(content)
    return placeholder
  })

  const parts = []
  let lastIndex = 0
  const regex = /\$([^$]+)\$/g
  let match

  while ((match = regex.exec(processedText)) !== null) {
    if (match.index > lastIndex) {
      const textContent = processedText.substring(lastIndex, match.index)
      const textParts = textContent.split(/(__DISPLAYMATH\d+__)/)
      textParts.forEach((part, idx) => {
        if (part.startsWith('__DISPLAYMATH')) {
          const mathIndex = parseInt(part.match(/\d+/)[0])
          parts.push({
            type: 'displaymath',
            content: displayMathParts[mathIndex],
            key: `displaymath-${mathIndex}`
          })
        } else if (part) {
          parts.push({
            type: 'text',
            content: part,
            key: `text-${lastIndex}-${idx}`
          })
        }
      })
    }
    
    parts.push({
      type: 'latex',
      content: match[1],
      key: `latex-${match.index}`
    })
    
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < processedText.length) {
    const textContent = processedText.substring(lastIndex)
    const textParts = textContent.split(/(__DISPLAYMATH\d+__)/)
    textParts.forEach((part, idx) => {
      if (part.startsWith('__DISPLAYMATH')) {
        const mathIndex = parseInt(part.match(/\d+/)[0])
        parts.push({
          type: 'displaymath',
          content: displayMathParts[mathIndex],
          key: `displaymath-${mathIndex}`
        })
      } else if (part) {
        parts.push({
          type: 'text',
          content: part,
          key: `text-${lastIndex}-${idx}`
        })
      }
    })
  }

  return (
    <span className={className}>
      {parts.map(part => {
        if (part.type === 'latex') {
          try {
            return <InlineMath key={part.key} math={part.content} />
          } catch (error) {
            return <span key={part.key}>${part.content}$</span>
          }
        } else if (part.type === 'displaymath') {
          try {
            return <BlockMath key={part.key} math={part.content} />
          } catch (error) {
            return <div key={part.key}>\[{part.content}\]</div>
          }
        }
        return <span key={part.key}>{part.content}</span>
      })}
    </span>
  )
}

export default LatexText
