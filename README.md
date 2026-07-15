# Portfolio — Frontend

Personal portfolio frontend built with **Next.js 15 (App Router)**, **TypeScript**, and **Tailwind CSS v4**. A single-page, scroll-driven experience that consumes a REST API from a separate [Laravel backend](https://github.com/Naufalfebri2/Portofolio-backend), which also powers a Livewire-based admin panel.

**Live demo:** _coming soon_
**Backend repo:** https://github.com/Naufalfebri2/Portofolio-backend

---

## Tech Stack

| Layer         | Technology                                    |
| ------------- | --------------------------------------------- |
| Framework     | Next.js 15 (App Router), TypeScript           |
| Styling       | Tailwind CSS v4, Framer Motion                |
| Data fetching | TanStack React Query, Axios                   |
| Theming       | next-themes (dark / light mode, system-aware) |
| Date picker   | react-datepicker                              |
| Icons         | lucide-react, react-icons                     |

## Features

- **Single-page landing** with scroll-linked sections: Hero, Experience timeline (animated with Framer Motion), Core Stack, Featured Projects, Contact
- **Projects listing & detail pages** (`/projects`, `/projects/[slug]`) with image gallery
- **Dark / light mode** — respects system preference by default, remembers manual toggle via `next-themes`
- **Contact form** with interview/meeting date scheduling (custom-themed `react-datepicker`), client-side error mapping from Laravel validation responses, and a WhatsApp hand-off after submission
- **Visitor analytics** — page view and time-on-page tracking sent via `navigator.sendBeacon` to the Laravel API
- **CV download** with server-side tracking
- Profile data (name, role/headline, bio, social links, photo) is fetched live from the backend, so the entire site updates the moment it's edited from the admin panel — no redeploy needed

## Getting Started

### Requirements

- Node.js 18+
- A running instance of the [Laravel backend](https://github.com/Naufalfebri2/Portofolio-backend)

### Installation

```bash
git clone https://github.com/Naufalfebri2/Portofolio-frontend.git
cd Portofolio-frontend

npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure Highlights

```
app/                     App Router pages (Home, /projects, /projects/[slug])
components/sections/     Landing page sections (Hero, Contact, Stacks, etc.)
components/layout/       Navbar, Footer
components/providers/    React Query & theme providers
components/ui/           Reusable UI primitives (e.g. ThemeToggle)
lib/api.ts               Axios instance, API base configuration
lib/hooks/                Data-fetching hooks (e.g. useProfile)
types/                    Shared TypeScript interfaces
```

## Design System

Accent color is an indigo-to-cyan gradient, defined as CSS custom properties in `app/globals.css` and shared with the Laravel frontend's Tailwind config, so both surfaces stay visually consistent even though they're built with different tooling (Tailwind v4 vs. v3).

## Author

**Naufal Febriansyah** — Information Systems student, Universitas Pamulang
[GitHub](https://github.com/Naufalfebri2) · [LinkedIn](https://www.linkedin.com/in/naufal-febriansyah-7b75b31b5/)
