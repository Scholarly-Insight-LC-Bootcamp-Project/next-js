"use client";

import React, { useState, useCallback } from "react";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = useCallback(
    async (e) => {
      e.preventDefault();
      if (!query.trim()) return;

      if (loading) return;

      setLoading(true);
      setError(null);

      try {

        const response = await fetch(
          `/api/arxiv?query=${encodeURIComponent(query)}&max_results=20`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch results");
        }

        setResults(data.results || []);
      } catch (err) {
        setError(err.message);
        setResults([]);
      }
      setLoading(false);
    },
    [query, loading]
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          arXiv Search
        </h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for papers (e.g., quantum computing, machine learning)..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <div className="font-bold mb-1">Error</div>
            <div className="whitespace-pre-line">{error}</div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Searching arXiv...</p>
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div>
            <p className="text-gray-600 mb-4 font-medium">
              Found {results.length} results
            </p>
            <div className="space-y-6">
              {results.map((result, index) => (
                <div
                  key={result.id || index}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
                    {result.title}
                  </h2>

                  {result.authors && result.authors.length > 0 && (
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium text-gray-700">
                        Authors:
                      </span>{" "}
                      {result.authors.join(", ")}
                    </div>
                  )}

                  <div className="flex gap-4 text-sm text-gray-500 mb-3">
                    {result.publishedDate && (
                      <div>
                        <span className="font-medium">Published:</span>{" "}
                        {result.publishedDate}
                      </div>
                    )}
                    {result.arxivId && (
                      <div>
                        <span className="font-medium">arXiv:</span>{" "}
                        {result.arxivId}
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {result.summary}
                  </p>

                  {result.categories && result.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {result.categories.slice(0, 5).map((cat, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3">
                    {result.id && (
                      <a
                        href={result.id}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                      >
                        View on arXiv
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    )}
                    {result.pdfLink && (
                      <a
                        href={result.pdfLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-green-600 hover:text-green-800 font-medium text-sm transition-colors"
                      >
                        Download PDF
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && results.length === 0 && query && !error && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mt-4 text-gray-600 text-lg">No results found</p>
            <p className="text-gray-500 text-sm">Try a different search term</p>
          </div>
        )}

        {/* Initial State */}
        {!loading && results.length === 0 && !query && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="mt-4 text-gray-600 text-lg font-medium">
              Start searching for academic papers
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Enter keywords like "quantum computing" or "neural networks"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
