import { XMLParser } from "fast-xml-parser";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const maxResults = searchParams.get("max_results") || 20;


  const url = `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(
    query
  )}&max_results=${maxResults}`;

  const response = await fetch(url);
  const xml = await response.text(); // arXiv returns XML, not JSON

  // Parse the XML
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    trimValues: true,
  });

  const data = parser.parse(xml);
  const feed = data.feed ?? {};
  const entries = Array.isArray(feed.entry)
    ? feed.entry
    : feed.entry
    ? [feed.entry]
    : [];

  return Response.json({
    success: true,
    results: entries,
    total: entries.length,
  });
}
