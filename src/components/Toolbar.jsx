function Btn({ onClick, title, active, children, className = '' }) {
  return (
    <button
      onMouseDown={e => { e.preventDefault(); onClick() }}
      title={title}
      className={`
        px-2 py-1 rounded-md text-sm font-medium transition-all select-none whitespace-nowrap
        ${active
          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
        } ${className}
      `}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-px h-4 bg-gray-200 dark:bg-[#333] mx-1 self-center flex-shrink-0" />
}

export default function Toolbar({ onNewPage, editor }) {
  if (!editor) return (
    <div className="h-9 border-b border-gray-100 dark:border-[#252525] bg-white dark:bg-[#191919]" />
  )

  const is = (type, attrs) => editor.isActive(type, attrs)
  const run = (cmd) => cmd.run()

  return (
    <div className="flex items-center gap-0.5 px-3 py-1.5 border-b border-gray-100 dark:border-[#252525] bg-white dark:bg-[#191919] overflow-x-auto scrollbar-thin shrink-0">

      {/* Text styles */}
      <Btn onClick={() => run(editor.chain().focus().toggleBold())}      active={is('bold')}      title="Negrito (Ctrl+B)"    className="font-bold">B</Btn>
      <Btn onClick={() => run(editor.chain().focus().toggleItalic())}    active={is('italic')}    title="Itálico (Ctrl+I)"    className="italic">I</Btn>
      <Btn onClick={() => run(editor.chain().focus().toggleUnderline())} active={is('underline')} title="Sublinhado (Ctrl+U)" className="underline">U</Btn>
      <Btn onClick={() => run(editor.chain().focus().toggleStrike())}    active={is('strike')}    title="Tachado"             className="line-through">S</Btn>
      <Btn onClick={() => run(editor.chain().focus().toggleHighlight())} active={is('highlight')} title="Destaque">🖊</Btn>
      <Btn onClick={() => run(editor.chain().focus().toggleCode())}      active={is('code')}      title="Código inline" className="font-mono text-xs">` `</Btn>

      <Divider />

      {/* Headings */}
      <Btn onClick={() => run(editor.chain().focus().toggleHeading({ level: 1 }))} active={is('heading', { level: 1 })} title="Título 1">H1</Btn>
      <Btn onClick={() => run(editor.chain().focus().toggleHeading({ level: 2 }))} active={is('heading', { level: 2 })} title="Título 2">H2</Btn>
      <Btn onClick={() => run(editor.chain().focus().toggleHeading({ level: 3 }))} active={is('heading', { level: 3 })} title="Título 3">H3</Btn>
      <Btn onClick={() => run(editor.chain().focus().setParagraph())}               active={is('paragraph')}            title="Parágrafo">¶</Btn>

      <Divider />

      {/* Lists */}
      <Btn onClick={() => run(editor.chain().focus().toggleBulletList())}  active={is('bulletList')}  title="Lista com marcadores">• Lista</Btn>
      <Btn onClick={() => run(editor.chain().focus().toggleOrderedList())} active={is('orderedList')} title="Lista numerada">1. Lista</Btn>
      <Btn onClick={() => run(editor.chain().focus().toggleTaskList())}    active={is('taskList')}    title="Lista de tarefas (☑)">☑ Tasks</Btn>

      <Divider />

      {/* Blocks */}
      <Btn onClick={() => run(editor.chain().focus().toggleBlockquote())} active={is('blockquote')} title="Citação">❝</Btn>
      <Btn onClick={() => run(editor.chain().focus().toggleCodeBlock())}  active={is('codeBlock')}  title="Bloco de código" className="font-mono text-xs">{'</>'}</Btn>
      <Btn onClick={() => run(editor.chain().focus().setHorizontalRule())} title="Linha divisória">—</Btn>

      <Divider />

      {/* History */}
      <Btn onClick={() => run(editor.chain().focus().undo())} title="Desfazer (Ctrl+Z)">↩</Btn>
      <Btn onClick={() => run(editor.chain().focus().redo())} title="Refazer (Ctrl+Y)">↪</Btn>

      {/* New page */}
      <button
        onClick={onNewPage}
        className="ml-auto text-xs text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 transition whitespace-nowrap flex-shrink-0"
      >
        + Página
      </button>
    </div>
  )
}
