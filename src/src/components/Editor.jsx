import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Link from '@tiptap/extension-link'
import CharacterCount from '@tiptap/extension-character-count'

function fdate(ts) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
  }).format(new Date(ts))
}

export default function Editor({ page, onContentChange, onTitleChange, onEmojiClick, onEditorReady }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Highlight.configure({ multicolor: false }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      CharacterCount,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') return 'Título...'
          return 'Escreva algo, ou use Ctrl+B, Ctrl+I, Ctrl+U...'
        },
      }),
    ],
    content: page?.content || '',
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'notion-editor outline-none min-h-96',
        spellcheck: 'true',
      },
    },
  })

  // Notify parent when editor is ready (for Toolbar)
  useEffect(() => {
    if (editor && onEditorReady) onEditorReady(editor)
    return () => { if (onEditorReady) onEditorReady(null) }
  }, [editor])

  // Sync content when switching pages
  useEffect(() => {
    if (!editor || !page) return
    const current = editor.getHTML()
    if (current !== page.content) {
      editor.commands.setContent(page.content || '', false)
    }
  }, [page?.id])

  if (!page) {
    return (
      <div className="flex-1 flex items-center justify-center flex-col gap-3 select-none">
        <span className="text-6xl text-gray-200 dark:text-gray-800">✦</span>
        <p className="text-lg font-medium text-gray-400 dark:text-gray-600">Selecione ou crie uma página</p>
        <p className="text-sm text-gray-300 dark:text-gray-700">Use a barra lateral para navegar</p>
      </div>
    )
  }

  const wordCount = editor?.storage?.characterCount?.words() ?? 0

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-3xl mx-auto px-6 md:px-16 pt-10 pb-32">

        {/* Emoji + Title */}
        <div className="flex items-start gap-3 mb-1">
          <button
            className="text-5xl leading-none mt-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl p-1.5 transition flex-shrink-0"
            onClick={onEmojiClick}
            title="Trocar ícone"
          >
            {page.emoji}
          </button>
          <input
            key={page.id}
            className="
              flex-1 text-[2.4rem] sm:text-[2.6rem] font-bold tracking-tight
              border-none outline-none bg-transparent
              text-gray-900 dark:text-gray-50
              placeholder-gray-200 dark:placeholder-gray-800
              leading-tight min-w-0 mt-1
            "
            value={page.title}
            placeholder="Sem título"
            onChange={e => onTitleChange(e.target.value)}
          />
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-8 pl-[68px]">
          <span className="text-xs text-gray-400 dark:text-gray-600">
            Editado {fdate(page.updated_at)}
          </span>
          <span className="text-gray-200 dark:text-gray-800 select-none">·</span>
          <span className="text-xs text-gray-400 dark:text-gray-600">
            {wordCount} {wordCount === 1 ? 'palavra' : 'palavras'}
          </span>
        </div>

        {/* TipTap content */}
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
