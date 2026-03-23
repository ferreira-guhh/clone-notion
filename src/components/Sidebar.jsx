import PageItem from './PageItem'
import { useAuth } from '../contexts/AuthContext'

export default function Sidebar({
  open, pages, activeId, expandedIds,
  onSelect, onToggle, onNewPage, onNewChild,
  onContextMenu, renamingId, renameValue,
  onRenameChange, onRenameCommit, onRenameKey,
  emojiPickerId, onEmojiClick, onEmojiSelect, onEmojiClose,
  onSearch, dark, onToggleDark, onClose,
}) {
  const { user, signOut } = useAuth()
  const rootPages = pages.filter(p => !p.parent_id)

  return (
    <aside className={`
      flex flex-col flex-shrink-0 transition-all duration-200 overflow-hidden
      bg-[#f7f7f5] dark:bg-[#202020]
      border-r border-gray-200 dark:border-[#2e2e2e]
      ${open ? 'w-60 min-w-[240px]' : 'w-0 min-w-0'}
    `}>
      <div className="w-60 flex flex-col h-full overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-1.5 px-3 py-3 border-b border-gray-200 dark:border-[#2e2e2e]">
          <span className="font-bold text-sm tracking-tight flex-1 text-gray-900 dark:text-gray-100">✦ Meu Espaço</span>
          <button onClick={onSearch} title="Buscar (Ctrl+K)"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-600 hover:bg-gray-200 dark:hover:bg-white/10 transition text-sm">
            🔍
          </button>
          <button onClick={onToggleDark} title="Modo escuro"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-600 hover:bg-gray-200 dark:hover:bg-white/10 transition text-sm">
            {dark ? '☀' : '◐'}
          </button>
          <button onClick={onClose} title="Fechar sidebar"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-600 hover:bg-gray-200 dark:hover:bg-white/10 transition text-xs">
            ◁
          </button>
        </div>

        {/* Label */}
        <p className="px-3 pt-3 pb-1 text-[11px] font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-600">
          Páginas
        </p>

        {/* Page list */}
        <div className="flex-1 overflow-y-auto py-1 scrollbar-thin">
          {pages.length === 0 ? (
            <p className="px-3 py-2 text-sm text-gray-400 dark:text-gray-600 italic">Nenhuma página ainda</p>
          ) : (
            rootPages.map(page => (
              <PageItem
                key={page.id}
                page={page}
                pages={pages}
                depth={0}
                activeId={activeId}
                expandedIds={expandedIds}
                onSelect={onSelect}
                onToggle={onToggle}
                onNewChild={onNewChild}
                onContextMenu={onContextMenu}
                renamingId={renamingId}
                renameValue={renameValue}
                onRenameChange={onRenameChange}
                onRenameCommit={onRenameCommit}
                onRenameKey={onRenameKey}
                emojiPickerId={emojiPickerId}
                onEmojiClick={onEmojiClick}
                onEmojiSelect={onEmojiSelect}
                onEmojiClose={onEmojiClose}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-[#2e2e2e] p-2 space-y-1">
          <button
            onClick={() => onNewPage(null)}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-gray-500 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 border border-dashed border-gray-300 dark:border-[#3a3a3a] transition"
          >
            <span className="text-base">+</span>
            <span>Nova Página</span>
          </button>

          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300 flex-shrink-0">
              {user?.email?.[0]?.toUpperCase() || '?'}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-500 truncate flex-1 min-w-0">
              {user?.email}
            </span>
            <button
              onClick={signOut}
              title="Sair"
              className="text-xs text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition flex-shrink-0"
            >
              ⎋
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
