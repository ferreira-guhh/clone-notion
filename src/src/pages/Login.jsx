import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode]       = useState('login') // 'login' | 'signup'
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await signIn(email, password)
      } else {
        await signUp(email, password)
        setSuccess('Conta criada! Verifique seu e-mail para confirmar o cadastro.')
      }
    } catch (err) {
      const msgs = {
        'Invalid login credentials': 'E-mail ou senha incorretos.',
        'Email not confirmed': 'Confirme seu e-mail antes de entrar.',
        'User already registered': 'Este e-mail já está cadastrado.',
        'Password should be at least 6 characters': 'A senha deve ter no mínimo 6 caracteres.',
      }
      setError(msgs[err.message] || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f7f5] dark:bg-[#191919] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">✦</div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Meu Notion Pessoal
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Seu espaço de pensamento e organização
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#222] border border-gray-200 dark:border-[#2e2e2e] rounded-2xl p-8 shadow-sm">
          <h2 className="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-100">
            {mode === 'login' ? 'Entrar na sua conta' : 'Criar conta'}
          </h2>

          {error && (
            <div className="mb-4 px-3 py-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 px-3 py-2 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="voce@exemplo.com"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 text-sm outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Senha
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="mínimo 6 caracteres"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 text-sm outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-100 disabled:opacity-50 transition"
            >
              {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-gray-500 dark:text-gray-500">
            {mode === 'login' ? (
              <>Não tem conta?{' '}
                <button onClick={() => { setMode('signup'); setError(''); setSuccess('') }}
                  className="text-gray-900 dark:text-gray-200 font-medium hover:underline">
                  Criar agora
                </button>
              </>
            ) : (
              <>Já tem conta?{' '}
                <button onClick={() => { setMode('login'); setError(''); setSuccess('') }}
                  className="text-gray-900 dark:text-gray-200 font-medium hover:underline">
                  Entrar
                </button>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
          100% gratuito · Seus dados ficam no seu Supabase
        </p>
      </div>
    </div>
  )
}
