'use client'

import { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import { remarkUnderline } from '@/lib/remarkUnderline'
import type { Components } from 'react-markdown'

interface MarkdownPreviewProps {
  children: string
  className?: string
}

export function MarkdownPreview({ children, className = '' }: MarkdownPreviewProps) {
  const components: Components = {
    p: ({ node, ...props }) => <p className="text-ink-700 mb-2" {...props} />,
    strong: ({ node, ...props }) => <strong className="font-bold text-ink-900" {...props} />,
    em: ({ node, ...props }) => <em className="italic text-ink-800" {...props} />,
    u: ({ node, ...props }) => <u className="underline text-ink-800" {...props} />,
    code: ({ node, inline, children, ...props }: any) => (
      <code
        className={`${
          inline
            ? 'bg-ink-100 px-1.5 py-0.5 rounded text-sm font-mono text-ink-800'
            : 'block bg-ink-50 p-3 rounded overflow-x-auto'
        }`}
        {...props}
      >
        {children}
      </code>
    ),
    a: ({ node, ...props }) => (
      <a className="text-trades-500 hover:underline" {...props} />
    ),
  }

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks, remarkUnderline]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
