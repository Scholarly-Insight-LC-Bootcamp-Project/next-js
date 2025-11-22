import React from 'react'
import xml2js from 'xml2js'
import ArticleHeader from '@/components/articles/ArticleHeader'
import ArticleAbstract from '@/components/articles/ArticleAbstract'
import ArticleLink from '@/components/articles/ArticleLink'
import CitationGenerator from '@/components/articles/CitationGenerator'
import PDFAnnotatorWrapper from '@/components/articles/PDFAnnotatorWrapper'
import ArticleRecommendations from '@/components/articles/ArticleRecommendations'

const Articles = async ({params}) => {
  const { article_id } = await params
  
  const response = await fetch(`http://export.arxiv.org/api/query?id_list=${article_id}`)
  const data = await response.text()
  
  const parser = new xml2js.Parser()
  const result = await parser.parseStringPromise(data)
  
  const entry = result.feed?.entry?.[0]
  
  if (!entry) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
        <p>No article found with ID: {article_id}</p>
      </div>
    )
  }
  
  const title = entry.title?.[0]?.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim()
  const summary = entry.summary?.[0]
  const published = entry.published?.[0]
  const authors = entry.author?.map(author => author.name?.[0]) || []
  
  const primaryCategory = entry['arxiv:primary_category']?.[0]?.$?.term || 
                          entry.category?.[0]?.$?.term || 
                          'cs.AI'
  
  const recommendationsResponse = await fetch(
    `http://export.arxiv.org/api/query?search_query=cat:${primaryCategory}&max_results=4&sortBy=submittedDate&sortOrder=descending`
  )
  const recommendationsData = await recommendationsResponse.text()
  const recommendationsResult = await parser.parseStringPromise(recommendationsData)
  
  const recommendationEntries = recommendationsResult.feed?.entry || []
  const recommendations = recommendationEntries
    .filter(rec => {
      const recId = rec.id?.[0]?.split('/').pop()?.replace('abs/', '')
      return recId !== article_id
    })
    .slice(0, 3)
    .map(rec => ({
      id: rec.id?.[0]?.split('/').pop()?.replace('abs/', ''),
      title: rec.title?.[0]?.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim(),
      authors: rec.author?.map(author => author.name?.[0]) || [],
      summary: rec.summary?.[0],
      published: rec.published?.[0]
    }))
  
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto p-6 max-w-7xl">
        <ArticleHeader 
          title={title || 'Article Not Found'} 
          authors={authors} 
          published={published} 
        />
        
        <ArticleAbstract summary={summary} />
        
        <ArticleLink articleId={article_id} />
        
        <PDFAnnotatorWrapper articleId={article_id} />
        
        <CitationGenerator 
          title={title}
          authors={authors}
          published={published}
          articleId={article_id}
        />
        
        <ArticleRecommendations recommendations={recommendations} />
      </div>
    </div>
  )
}

export default Articles