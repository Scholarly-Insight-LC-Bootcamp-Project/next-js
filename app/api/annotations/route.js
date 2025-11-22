// API route to save annotations
import { NextResponse } from 'next/server'
import { saveAnnotation, getAnnotations } from '@/lib/firestore'

export async function POST(request) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.articleId || !data.userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: articleId and userId' 
      }, { status: 400 })
    }
    
    const result = await saveAnnotation(data)
    
    if (result.success) {
      return NextResponse.json({ success: true, annotation: result })
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error('POST /api/annotations error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const articleId = searchParams.get('articleId')
    
    if (!articleId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Article ID required' 
      }, { status: 400 })
    }
    
    const result = await getAnnotations(articleId)
    
    if (result.success) {
      return NextResponse.json({ success: true, annotations: result.annotations })
    } else {
      console.error('getAnnotations failed:', result.error)
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error('GET /api/annotations error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}
