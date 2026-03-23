<div align="center">

# ✦ Notion Pessoal

**Clone do Notion feito do zero — editor rico, hierarquia de páginas, modo escuro e PWA instalável no celular.**

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![TipTap](https://img.shields.io/badge/TipTap-2-1A1A1A?style=flat-square)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-instalável-5A0FC8?style=flat-square)
![License](https://img.shields.io/badge/licença-MIT-green?style=flat-square)

[🚀 Demo ao vivo](#) · [📸 Screenshots](#screenshots) · [⚙️ Instalação](#instalação)

</div>

---

## 📌 Sobre o projeto

Aplicação web de anotações pessoais inspirada no Notion, construída do zero com foco em **performance, usabilidade diária e custo zero**.

Funciona no navegador e pode ser instalado no celular como aplicativo nativo (PWA). Todos os dados ficam no Supabase do próprio usuário — sem dependência de serviços pagos.

> *"Não construir tudo… construir o necessário, bem feito."*

---

## ✨ Funcionalidades

- 📝 **Editor rico com TipTap** — negrito, itálico, títulos, listas, tarefas, citações, blocos de código e mais
- 🗂️ **Hierarquia de páginas** — crie páginas e subpáginas com árvore expansível
- 🔍 **Busca global** — encontre qualquer página por título ou conteúdo (`Ctrl+K`)
- 🌙 **Modo escuro / claro** — preferência salva automaticamente
- 💾 **Auto-save** — conteúdo salvo automaticamente com debounce
- 📱 **PWA** — instale como app no Android e iPhone
- 🔐 **Autenticação segura** — login/cadastro com e-mail via Supabase Auth
- 🛡️ **Row Level Security** — cada usuário acessa apenas suas próprias páginas
- 🎨 **Troca de emoji** por página
- ↩️ **Undo / Redo** nativo
- ☑️ **Lista de tarefas** com checkboxes clicáveis
- 📊 **Contador de palavras** em tempo real

---

## 🖥️ Screenshots

> *(adicione screenshots aqui após o deploy)*

---

## 🧱 Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + Vite 5 |
| Estilização | Tailwind CSS 3 |
| Editor | TipTap 2 |
| Backend / Banco | Supabase (PostgreSQL + Auth) |
| PWA | vite-plugin-pwa + Workbox |
| Deploy | Vercel (gratuito) |

---

## ⚙️ Instalação

### Pré-requisitos
- Node.js 18+
- Conta gratuita no [Supabase](https://supabase.com)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/notion-pessoal.git
cd notion-pessoal
npm install
```

### 2. Configure o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. No **SQL Editor**, rode o conteúdo de `supabase/schema.sql`
3. Em **Settings → API**, copie a URL e a chave `anon`

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

### 4. Rode em desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173)

### 5. Build para produção

```bash
npm run build
```

---

## 🚀 Deploy (Vercel)

```bash
npm install -g vercel
vercel
```

Adicione as variáveis de ambiente em **Vercel → Settings → Environment Variables** e rode `vercel --prod`.

---

## 🗺️ Roadmap

- [x] Editor rico com TipTap
- [x] Hierarquia de páginas
- [x] Autenticação com Supabase
- [x] PWA instalável
- [x] Modo escuro
- [ ] Integração com IA local via Ollama
- [ ] Compartilhamento de páginas (links públicos)
- [ ] Histórico de versões
- [ ] Upload de imagens

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

<div align="center">
Feito com ☕ e React
</div>
