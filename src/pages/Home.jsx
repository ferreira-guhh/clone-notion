import { useState, useEffect, useRef } from 'react'
import { usePages } from '../hooks/usePages'
import Sidebar from '../components/Sidebar'
import Editor from '../components/Editor'
import Toolbar from '../components/Toolbar'
import { EmojiPicker } from '../components/PageItem'
import { useEditor } from '@tiptap/react'

const SETTINGS_KEY = 'notion_settings_v3'

function SearchModal({ pages, onSelect, onClose }) {
  const [q, setQ] = useState('')
  const filtered = pages.filter(p =>
    p.title.toLowerCase().includes(q.toLowerCase()) ||
    (p.content || '').toLowerCase().includes(q.toLowerCase())
  )
  function fdate(ts) {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(ts))
  }
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-20 px-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-[#222] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-100 dark:border-[#333]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-[#2e2e2e]">
          <span className="text-gray-400 text-base flex-shrink-0">🔍</span>
          <input
            autoFocus
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Buscar páginas..."
            className="flex-1 bg-transparent outline-none text-base text-gray-900 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-700"
          />
          <kbd className="hidden sm:block text-xs text-gray-300 dark:text-gray-700 border border-gray-200 dark:border-[#444] rounded px-1.5 py-0.5">Esc</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {filtered.length === 0
            ? <p className="p-8 text-center text-sm text-gray-400 dark:text-gray-600">{q ? 'Nenhum resultado' : 'Digite para buscar...'}</p>
            : filtered.map(p => (
              <button
                key={p.id}
                onClick={() => { onSelect(p.id); onClose() }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 transition text-left"
              >
                <span className="text-xl flex-shrink-0">{p.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{p.title || 'Sem título'}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">Editado {fdate(p.updated_at)}</p>
                </div>
              </button>
            ))
          }
        </div>
      </div>
    </div>
  )
}

function ContextMenu({ x, y, onRename, onNewChild, onDelete, onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.button === 0) onClose() }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [onClose])

  // Clamp to viewport
  const cx = Math.min(x, window.innerWidth - 170)
  const cy = Math.min(y, window.innerHeight - 130)

  return (
    <div
      className="fixed z-50 bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#3a3a3a] rounded-xl p-1 shadow-xl"
      style={{ top: cy, left: cx, minWidth: 162 }}
      onMouseDown={e => e.stopPropagation()}
    >
      {[
        { icon: '✏️', label: 'Renomear',       fn: onRename,   danger: false },
        { icon: '📄', label: 'Nova subpágina',  fn: onNewChild, danger: false },
        { icon: '🗑️', label: 'Excluir página',  fn: onDelete,   danger: true  },
      ].map(item => (
        <button
          key={item.label}
          onClick={item.fn}
          className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition
            ${item.danger
              ? 'text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
            }`}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  )
}

export default function Home() {
  const { pages, loading, createPage, updateTitle, updateContent, updateEmoji, deletePage } = usePages()
  const [cfg, setCfg] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || { dark: false, sb: true } }
    catch { return { dark: false, sb: true } }
  })
  const [activeId, setActiveId]     = useState(null)
  const [expanded, setExpanded]     = useState(new Set())
  const [renamingId, setRenamingId] = useState(null)
  const [renameVal, setRenameVal]   = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [saveStatus, setSaveStatus] = useState('saved')
  const [ctx, setCtx]               = useState(null)
  const [emojiPickerId, setEmojiPickerId] = useState(null)
  const [emojiPos, setEmojiPos]     = useState({ x: 0, y: 0 })
  const [editorInstance, setEditorInstance] = useState(null)
  const saveTimer = useRef(null)
  const dark = cfg.dark

  // Global keyboard shortcuts
  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setShowSearch(true) }
      if (e.key === 'Escape') { setShowSearch(false); setCtx(null); setEmojiPickerId(null) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Dark mode class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(cfg))
  }, [cfg, dark])

  // Select first page after load
  useEffect(() => {
    if (!loading && pages.length > 0 && !activeId) setActiveId(pages[0].id)
  }, [loading, pages])

  const activePage = pages.find(p => p.id === activeId) || null
  const parentPage = activePage?.parent_id ? pages.find(p => p.id === activePage.parent_id) : null

  async function handleNewPage(parentId = null) {
    try {
      const p = await createPage(parentId)
      setActiveId(p.id)
      if (parentId) setExpanded(prev => new Set([...prev, parentId]))
      setTimeout(() => startRename(p.id, p.title), 80)
    } catch (err) { console.error('createPage error:', err) }
  }

  function startRename(id, current) {
    setRenamingId(id)
    setRenameVal(current || '')
    setCtx(null)
  }

  function commitRename() {
    if (!renamingId) return
    updateTitle(renamingId, renameVal.trim() || 'Sem título').catch(console.error)
    setRenamingId(null)
  }

  function scheduleContentSave(content) {
    setSaveStatus('saving')
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      try {
        await updateContent(activeId, content)
        setSaveStatus('saved')
      } catch {
        setSaveStatus('erro')
      }
    }, 900)
  }

  function scheduleTitleSave(title) {
    setSaveStatus('saving')
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      try {
        await updateTitle(activeId, title)
        setSaveStatus('saved')
      } catch {
        setSaveStatus('erro')
      }
    }, 900)
  }

  function toggleExpand(id) {
    setExpanded(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  function handleDeletePage(id) {
    deletePage(id).catch(console.error)
    if (activeId === id) setActiveId(pages.find(p => p.id !== id)?.id || null)
    setCtx(null)
  }

  return (
    <div className="flex h-screen bg-white dark:bg-[#191919] text-gray-900 dark:text-gray-100 overflow-hidden">

      {/* ── SIDEBAR ── */}
      <Sidebar
        open={cfg.sb}
        pages={pages}
        activeId={activeId}
        expandedIds={expanded}
        onSelect={setActiveId}
        onToggle={toggleExpand}
        onNewPage={handleNewPage}
        onNewChild={handleNewPage}
        onContextMenu={(e, id) => setCtx({ x: e.clientX, y: e.clientY, id })}
        renamingId={renamingId}
        renameValue={renameVal}
        onRenameChange={setRenameVal}
        onRenameCommit={commitRename}
        onRenameKey={e => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') setRenamingId(null) }}
        emojiPickerId={emojiPickerId}
        onEmojiClick={(e, id) => {
          const r = e.currentTarget.getBoundingClientRect()
          setEmojiPos({ x: r.left, y: r.bottom + 4 })
          setEmojiPickerId(id)
        }}
        onEmojiSelect={(id, em) => { updateEmoji(id, em).catch(console.error); setEmojiPickerId(null) }}
        onEmojiClose={() => setEmojiPickerId(null)}
        onSearch={() => setShowSearch(true)}
        dark={dark}
        onToggleDark={() => setCfg(p => ({ ...p, dark: !p.dark }))}
        onClose={() => setCfg(p => ({ ...p, sb: false }))}
      />

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <header className="flex items-center gap-2 px-4 sm:px-5 py-2.5 border-b border-gray-100 dark:border-[#2e2e2e] bg-white dark:bg-[#191919] min-h-[46px] shrink-0">
          {!cfg.sb && (
            <button
              onClick={() => setCfg(p => ({ ...p, sb: true }))}
              title="Abrir sidebar"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-white/10 transition text-sm mr-0.5 shrink-0"
            >▷</button>
          )}

          {/* Breadcrumb */}
          <nav className="flex-1 flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-600 min-w-0 overflow-hidden">
            {parentPage && (
              <>
                <button
                  onClick={() => setActiveId(parentPage.id)}
                  className="hover:text-gray-700 dark:hover:text-gray-300 transition truncate max-w-[100px] shrink-0"
                >
                  {parentPage.emoji} {parentPage.title}
                </button>
                <span className="shrink-0">/</span>
              </>
            )}
            <span className="font-medium text-gray-700 dark:text-gray-300 truncate min-w-0">
              {activePage ? `${activePage.emoji} ${activePage.title || 'Sem título'}` : '—'}
            </span>
          </nav>

          {/* Save status */}
          <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 transition-all ${
            saveStatus === 'saved'  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
            saveStatus === 'saving' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                                      'bg-red-100   dark:bg-red-900/30   text-red-700   dark:text-red-400'
          }`}>
            {saveStatus === 'saved'  ? '✓ Salvo'
           : saveStatus === 'saving' ? '● Salvando...'
           :                           '✕ Erro'}
          </span>
        </header>

        {/* Toolbar */}
        <Toolbar onNewPage={() => handleNewPage(activePage?.parent_id || null)} editor={editorInstance} />

        {/* Editor */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-4xl animate-pulse select-none">✦</span>
          </div>
        ) : (
          <Editor
            page={activePage}
            onContentChange={scheduleContentSave}
            onTitleChange={scheduleTitleSave}
            onEditorReady={setEditorInstance}
            onEmojiClick={e => {
              if (!activePage) return
              const r = e.currentTarget.getBoundingClientRect()
              setEmojiPos({ x: r.left, y: r.bottom + 8 })
              setEmojiPickerId(activePage.id)
            }}
          />
        )}
      </main>

      {/* ── MODALS ── */}

      {showSearch && (
        <SearchModal pages={pages} onSelect={setActiveId} onClose={() => setShowSearch(false)} />
      )}

      {ctx && (
        <ContextMenu
          x={ctx.x} y={ctx.y}
          onRename={() => { const p = pages.find(x => x.id === ctx.id); if (p) startRename(p.id, p.title) }}
          onNewChild={() => { handleNewPage(ctx.id); setCtx(null) }}
          onDelete={() => handleDeletePage(ctx.id)}
          onClose={() => setCtx(null)}
        />
      )}

      {emojiPickerId && (
        <div className="fixed inset-0 z-40" onClick={() => setEmojiPickerId(null)}>
          <EmojiPicker
            style={{ position: 'fixed', top: emojiPos.y, left: Math.min(emojiPos.x, window.innerWidth - 200) }}
            onSelect={em => { updateEmoji(emojiPickerId, em).catch(console.error); setEmojiPickerId(null) }}
            onClose={() => setEmojiPickerId(null)}
          />
        </div>
      )}
    </div>
  )
}
