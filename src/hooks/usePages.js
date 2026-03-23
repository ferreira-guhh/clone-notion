import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function usePages() {
  const { user } = useAuth()
  const [pages, setPages]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  // Carregar todas as páginas do usuário
  const fetchPages = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('user_id', user.id)
        .order('position', { ascending: true })
        .order('created_at', { ascending: true })

      if (error) throw error
      setPages(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetchPages() }, [fetchPages])

  // Criar nova página
  async function createPage(parentId = null) {
    const position = pages.filter(p => p.parent_id === parentId).length
    const { data, error } = await supabase
      .from('pages')
      .insert({
        user_id:   user.id,
        title:     'Nova Página',
        content:   '<h1>Nova Página</h1><p></p>',
        emoji:     '📄',
        parent_id: parentId,
        position,
      })
      .select()
      .single()

    if (error) throw error
    setPages(prev => [...prev, data])
    return data
  }

  // Atualizar título
  async function updateTitle(id, title) {
    setPages(prev => prev.map(p => p.id === id ? { ...p, title } : p))
    const { error } = await supabase.from('pages').update({ title }).eq('id', id)
    if (error) { fetchPages(); throw error }
  }

  // Atualizar conteúdo (debounced externamente)
  async function updateContent(id, content) {
    const { error } = await supabase.from('pages').update({ content }).eq('id', id)
    if (error) throw error
    setPages(prev => prev.map(p => p.id === id ? { ...p, content } : p))
  }

  // Atualizar emoji
  async function updateEmoji(id, emoji) {
    setPages(prev => prev.map(p => p.id === id ? { ...p, emoji } : p))
    const { error } = await supabase.from('pages').update({ emoji }).eq('id', id)
    if (error) { fetchPages(); throw error }
  }

  // Excluir página (filhos são excluídos via ON DELETE CASCADE no banco)
  async function deletePage(id) {
    // Remove localmente todos os filhos recursivamente para UX imediata
    const toDelete = new Set()
    function collect(pid) {
      toDelete.add(pid)
      pages.filter(p => p.parent_id === pid).forEach(p => collect(p.id))
    }
    collect(id)
    setPages(prev => prev.filter(p => !toDelete.has(p.id)))

    const { error } = await supabase.from('pages').delete().eq('id', id)
    if (error) { fetchPages(); throw error }
  }

  return { pages, loading, error, createPage, updateTitle, updateContent, updateEmoji, deletePage, refetch: fetchPages }
}
