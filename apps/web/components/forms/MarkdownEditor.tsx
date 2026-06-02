'use client'

import { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBold, faItalic, faUnderline, faCircleQuestion, faHeading, faList, faListOl, faQuoteLeft, faLink } from '@fortawesome/free-solid-svg-icons'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minLength?: number
  maxLength?: number
  rows?: number
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Enter your content...',
  minLength = 20,
  maxLength = 10000,
  rows = 6,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [showHelp, setShowHelp] = useState(false)

  const insertMarkdown = (before: string, after: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const selectedText = text.substring(start, end) || 'text'

    const beforeText = text.substring(0, start)
    const afterText = text.substring(end)
    const newText = beforeText + before + selectedText + after + afterText

    onChange(newText)

    // Restore cursor position
    setTimeout(() => {
      const newCursorPos = start + before.length + selectedText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
      textarea.focus()
    }, 0)
  }

  const handleBold = () => insertMarkdown('**', '**')
  const handleItalic = () => insertMarkdown('*', '*')
  const handleUnderline = () => insertMarkdown('__', '__')
  const handleHeading = () => insertMarkdown('# ', '')
  const handleList = () => insertMarkdown('- ', '')
  const handleNumList = () => insertMarkdown('1. ', '')
  const handleBlockquote = () => insertMarkdown('> ', '')
  const handleStrikethrough = () => insertMarkdown('~~', '~~')
  const handleLink = () => insertMarkdown('[', '](url)')

  const charCount = value.length
  const isValid = charCount >= (minLength || 0) && charCount <= (maxLength || Infinity)

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex gap-1 md:gap-2 p-1 md:p-2 bg-ink-50 border border-ink-200 rounded-t-lg items-center flex-wrap">
        {/* Text formatting */}
        <button
          onClick={handleBold}
          type="button"
          title="Bold"
          className="flex items-center justify-center w-7 h-7 md:w-9 md:h-9 rounded bg-white border border-ink-300 hover:bg-ink-100 transition text-ink-700 font-bold text-xs md:text-base"
        >
          B
        </button>
        <button
          onClick={handleItalic}
          type="button"
          title="Italic"
          className="flex items-center justify-center w-7 h-7 md:w-9 md:h-9 rounded bg-white border border-ink-300 hover:bg-ink-100 transition text-ink-700 italic text-xs md:text-base"
        >
          I
        </button>
        <button
          onClick={handleUnderline}
          type="button"
          title="Underline"
          className="flex items-center justify-center w-7 h-7 md:w-9 md:h-9 rounded bg-white border border-ink-300 hover:bg-ink-100 transition text-ink-700 underline text-xs md:text-base"
        >
          U
        </button>

        <div className="border-l border-ink-300 mx-0.5 md:mx-1" />

        {/* Block formatting */}
        <button
          onClick={handleHeading}
          type="button"
          title="Heading"
          className="flex items-center justify-center w-7 h-7 md:w-9 md:h-9 rounded bg-white border border-ink-300 hover:bg-ink-100 transition text-ink-700"
        >
          <FontAwesomeIcon icon={faHeading} className="h-3 w-3 md:h-4 md:w-4" />
        </button>
        <button
          onClick={handleList}
          type="button"
          title="List"
          className="flex items-center justify-center w-7 h-7 md:w-9 md:h-9 rounded bg-white border border-ink-300 hover:bg-ink-100 transition text-ink-700"
        >
          <FontAwesomeIcon icon={faList} className="h-3 w-3 md:h-4 md:w-4" />
        </button>

        <button
          onClick={handleNumList}
          type="button"
          title="Numbered list"
          className="flex items-center justify-center w-7 h-7 md:w-9 md:h-9 rounded bg-white border border-ink-300 hover:bg-ink-100 transition text-ink-700"
        >
          <FontAwesomeIcon icon={faListOl} className="h-3 w-3 md:h-4 md:w-4" />
        </button>

        <div className="border-l border-ink-300 mx-0.5 md:mx-1" />

        {/* Block elements */}
        <button
          onClick={handleBlockquote}
          type="button"
          title="Blockquote"
          className="flex items-center justify-center w-7 h-7 md:w-9 md:h-9 rounded bg-white border border-ink-300 hover:bg-ink-100 transition text-ink-700"
        >
          <FontAwesomeIcon icon={faQuoteLeft} className="h-3 w-3 md:h-4 md:w-4" />
        </button>
        <button
          onClick={handleStrikethrough}
          type="button"
          title="Strikethrough"
          className="flex items-center justify-center w-7 h-7 md:w-9 md:h-9 rounded bg-white border border-ink-300 hover:bg-ink-100 transition text-ink-700 line-through text-xs md:text-base"
        >
          S
        </button>

        <div className="border-l border-ink-300 mx-0.5 md:mx-1" />

        {/* Link */}
        <button
          onClick={handleLink}
          type="button"
          title="Link"
          className="flex items-center justify-center w-7 h-7 md:w-9 md:h-9 rounded bg-white border border-ink-300 hover:bg-ink-100 transition text-ink-700"
        >
          <FontAwesomeIcon icon={faLink} className="h-3 w-3 md:h-4 md:w-4" />
        </button>

        <div className="border-l border-ink-300 mx-0.5 md:mx-1 ml-auto" />

        {/* Help */}
        <button
          onClick={() => setShowHelp(!showHelp)}
          type="button"
          title="Show markdown help"
          className="flex items-center justify-center w-7 h-7 md:w-9 md:h-9 rounded bg-white border border-ink-300 hover:bg-ink-100 transition text-ink-700"
        >
          <FontAwesomeIcon icon={faCircleQuestion} className="h-3 w-3 md:h-4 md:w-4" />
        </button>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className="w-full px-3 py-2 border border-ink-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-trades-500 focus:border-trades-500 resize-none font-mono text-sm text-ink-900"
      />

      {/* Character Counter */}
      <div className="flex justify-between items-center text-xs text-ink-500">
        <div>
          {minLength && charCount < minLength && (
            <span className="text-amber-600">
              At least {minLength - charCount} more character{minLength - charCount !== 1 ? 's' : ''} needed
            </span>
          )}
          {isValid && minLength && charCount >= minLength && (
            <span className="text-green-600">✓ Ready to submit</span>
          )}
        </div>
        <div>
          {charCount} / {maxLength}
        </div>
      </div>

      {/* Collapsible Help */}
      {showHelp && (
        <div className="text-xs text-ink-500 bg-blue-50 border border-blue-200 rounded p-3">
          <div className="font-medium text-ink-700 mb-2">Markdown formatting:</div>
          <div className="grid grid-cols-2 gap-2">
            <div><span className="font-semibold">**bold**</span> for bold</div>
            <div><span className="italic">*italic*</span> for italic</div>
            <div><span className="underline">__underline__</span> for underline</div>
            <div><span className="line-through">~~strikethrough~~</span></div>
            <div><span className="font-semibold"># Heading</span> for heading</div>
            <div><span>- item</span> for bullet list</div>
            <div><span>1. item</span> for numbered list</div>
            <div><span className="text-ink-600">[text](url)</span> for link</div>
            <div className="col-span-2"><span>{'>'}  quote</span> for blockquote</div>
          </div>
        </div>
      )}
    </div>
  )
}
