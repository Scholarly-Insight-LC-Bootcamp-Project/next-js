'use client'

import dynamic from 'next/dynamic'

const ReactPDFViewerAnnotator = dynamic(
  () => import('@/components/articles/ReactPDFViewerAnnotator'),
  { 
    ssr: false, 
    loading: () => (
      <div className="my-8 p-8 text-center">
        <p className="text-lg">Loading PDF viewer...</p>
      </div>
    )
  }
)

export default function PDFAnnotatorWrapper({ articleId }) {
  return <ReactPDFViewerAnnotator articleId={articleId} />
}
