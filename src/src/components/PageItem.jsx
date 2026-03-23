import { useRef } from 'react'

const EMOJIS = ['📄','📔','📝','🚀','💡','⭐','🎯','📊','🔖','💼','🌱','🔥','💎','🎨','🧠','📌','✅','🗓️','🔍','💬']

export function EmojiPicker({ onSelect, onClose, style }) {
  return (
    <div className="fixed z-50 bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#3a3a3a] rounded-xl p-3 shadow-xl" style={style} onClick={e => e.stopPropagation()}>
      <div className="grid grid-cols-5 gap-1">
        {EMOJIS.map(em => (
          <button key={em} onClick={() => onSelect(em)}
            className="text-xl p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition">
            {em}
          </button>
        ))}
      </div>
      <button onClick={onClose} className="w-full mt-2 text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition">
        Fechar
      </button>
    </div>
  )
}

export default function PageItem({
  page, pages, depth = 0,
  activeId, expandedIds,
  onSelect, onToggle, onNewChild,
  onContextMenu, renamingId, renameValue,
  onRenameChange, onRenameCommit, onRenameKey,
  emojiPickerId, onEmojiClick, onEmojiSelect, onEmojiClose,
}) {
  const renameRef = useRef(null)
  const children = pages.filter(p => p.parent_id === page.id)
  const isActive = page.id === activeId
  const isExpanded = expandedIds.has(page.id)
  const isRenaming = renamingId === page.id
  const isEmojiOpen = emojiPickerId === page.id

  return (
    <div>
      <div
        className={`
          flex items-center gap-1 px-2 py-1 mx-1 rounded-lg cursor-pointer transition-colors group
          ${isActive
            ? 'bg-gray-200 dark:bg-[#2a2a2a]'
            : 'hover:bg-gray-100 dark:hover:bg-white/5'
          }
        `}
        style={{ paddingLeft: 8 + depth * 16 }}
        onClick={() => onSelect(page.id)}
        onContextMenu={e => { e.preventDefault(); onContextMenu(e, page.id) }}
      >
        {/* Expand toggle */}
        <button
          className="w-5 h-5 flex items-center justify-center rounded text-gray-400 dark:text-gray-600 hover:bg-gray-200 dark:hover:bg-white/10 flex-shrink-0 transition text-[10px]"
          style={{ opacity: children.length > 0 ? 1 : 0.25 }}
          onClick={e => { e.stopPropagation(); onToggle(page.id) }}
        >
          {isExpanded ? '▾' : '▸'}
        </button>

        {/* Emoji */}
        <span
          className="text-sm flex-shrink-0 cursor-pointer px-0.5 rounded hover:bg-gray-200 dark:hover:bg-white/10 transition relative"
          onClick={e => { e.stopPropagation(); onEmojiClick(e, page.id) }}
          title="Trocar ícone"
        >
          {page.emoji}
          {isEmojiOpen && (
            <EmojiPicker
              style={{ top: '100%', left: 0 }}
              onSelect={em => onEmojiSelect(page.id, em)}
              onClose={onEmojiClose}
            />
          )}
        </span>

        {/* Title / rename input */}
        {isRenaming ? (
          <input
            ref={renameRef}
            autoFocus
            value={renameValue}
            onChange={e => onRenameChange(e.target.value)}
            onBlur={onRenameCommit}
            onKeyDown={onRenameKey}
            onClick={e => e.stopPropagation()}
            className="flex-1 text-sm bg-white dark:bg-[#333] text-gray-900 dark:text-gray-100 rounded px-1 outline-none border border-gray-300 dark:border-[#555] min-w-0"
          />
        ) : (
          <span className={`flex-1 text-sm truncate min-w-0 ${isActive ? 'font-medium text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>
            {page.title || 'Sem título'}
          </span>
        )}

        {/* Add child button */}
        <button
          className="w-5 h-5 flex items-center justify-center rounded text-gray-400 dark:text-gray-600 opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-white/10 flex-shrink-0 transition text-sm"
          onClick={e => { e.stopPropagation(); onNewChild(page.id) }}
          title="Nova subpágina"
        >
          +
        </button>
      </div>

      {/* Children */}
      {isExpanded && children.map(child => (
        <PageItem
          key={child.id}
          page={child}
          pages={pages}
          depth={depth + 1}
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
      ))}
    </div>
  )
}
