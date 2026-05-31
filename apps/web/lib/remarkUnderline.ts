import { visit } from 'unist-util-visit'
import type { Node, Parent } from 'unist'

/**
 * Remark plugin to convert __text__ to <u>text</u>
 * Since markdown doesn't natively support underline, we use __ as a convention
 */
export function remarkUnderline() {
  return (tree: Node) => {
    visit(tree, 'text', (node: any, index: number, parent: Parent | undefined) => {
      if (!parent || !node.value) return

      // Split text by __ pattern
      const parts = node.value.split(/(__[^_]+__)/g)

      if (parts.length === 1) return // No underline syntax found

      const children: any[] = []

      for (const part of parts) {
        if (part.match(/^__[^_]+__$/)) {
          // This is underlined text
          const text = part.slice(2, -2) // Remove the __ markers
          children.push({
            type: 'html',
            value: `<u>${escapeHtml(text)}</u>`,
          })
        } else if (part) {
          // Regular text
          children.push({
            type: 'text',
            value: part,
          })
        }
      }

      if (children.length > 1) {
        // Replace this text node with multiple children
        parent.children.splice(index, 1, ...children)
      }
    })
  }
}

/**
 * Escape HTML special characters for safe rendering
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (char) => map[char])
}
