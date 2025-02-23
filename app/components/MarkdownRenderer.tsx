'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          pre: ({ node, children, ...props }) => (
            <div className="relative group my-4">
              <pre className="bg-[#1e1e1e] rounded-lg border border-gray-700 p-4" {...props}>
                {children}
              </pre>
              <button
                onClick={() => {
                  const code = children?.props?.children?.[0];
                  if (code) {
                    navigator.clipboard.writeText(code);
                  }
                }}
                className="absolute top-3 right-3 p-2 rounded-lg bg-gray-700 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-600"
                title="Copier le code"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                </svg>
              </button>
            </div>
          ),
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline ? (
              <code className={className} {...props}>
                {children}
              </code>
            ) : (
              <code className="bg-gray-800 text-gray-200 rounded-md px-1.5 py-0.5" {...props}>
                {children}
              </code>
            );
          },
          p: ({ node, children, ...props }) => (
            <p className="text-gray-200 leading-7 mb-4" {...props}>
              {children}
            </p>
          ),
          ul: ({ node, children, ...props }) => (
            <ul className="list-disc list-inside space-y-2 mb-4 text-gray-200" {...props}>
              {children}
            </ul>
          ),
          ol: ({ node, children, ...props }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-200" {...props}>
              {children}
            </ol>
          ),
          li: ({ node, children, ...props }) => (
            <li className="text-gray-200" {...props}>
              {children}
            </li>
          ),
          h1: ({ node, children, ...props }) => (
            <h1 className="text-2xl font-bold text-gray-100 mb-4 mt-6" {...props}>
              {children}
            </h1>
          ),
          h2: ({ node, children, ...props }) => (
            <h2 className="text-xl font-bold text-gray-100 mb-3 mt-5" {...props}>
              {children}
            </h2>
          ),
          h3: ({ node, children, ...props }) => (
            <h3 className="text-lg font-bold text-gray-100 mb-2 mt-4" {...props}>
              {children}
            </h3>
          ),
          blockquote: ({ node, children, ...props }) => (
            <blockquote className="border-l-4 border-gray-600 pl-4 italic my-4 text-gray-300" {...props}>
              {children}
            </blockquote>
          ),
          table: ({ node, children, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse text-gray-200" {...props}>
                {children}
              </table>
            </div>
          ),
          th: ({ node, children, ...props }) => (
            <th className="bg-gray-800 px-4 py-2 text-left border border-gray-700" {...props}>
              {children}
            </th>
          ),
          td: ({ node, children, ...props }) => (
            <td className="px-4 py-2 border border-gray-700" {...props}>
              {children}
            </td>
          ),
          a: ({ node, children, href, ...props }) => (
            <a 
              href={href}
              className="text-blue-400 hover:text-blue-300 transition-colors underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
} 