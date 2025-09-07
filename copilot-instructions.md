# Copilot Instructions for QuantumLeap

## 🎯 Project Context
This is a **Next.js 15 + Tailwind CSS + ShadCN UI** project called **QuantumLeap**.  
Target users: academic researchers, scientists, and university students.  
Main features: publishing scientific posts, collaboration, real-time chat, admin moderation, and profile management.

## 🛠️ Copilot Responsibilities
- Work on **all parts of the project**:  
  - `app/` (Next.js App Router pages & layouts)  
  - `components/` (UI components, forms, cards, modals)  
  - `lib/` (utilities & helpers, but not limited to this)  
- Do **NOT** restrict edits to `lib/` only.  

## 🔑 Key Requirements
1. **SEO**  
   - Add `<head>` metadata (title, description, Open Graph, Twitter cards).  
   - Use Next.js `metadata` API when possible.  

2. **Social Preview**  
   - Ensure Open Graph (`og:`) and Twitter meta tags exist for previews.  
   - Default preview image: `/public/preview.png`.  

3. **Clean Code**  
   - Follow React + Next.js best practices.  
   - Keep components small and reusable.  
   - Use functional components, hooks, and ShadCN primitives.  

4. **Lazy Loading & Performance**  
   - Use `next/dynamic` for heavy components.  
   - Add loading states with skeletons/spinners.  
   - Optimize images with `next/image`.  

5. **Styling & Layout**  
   - TailwindCSS with utility-first classes.  
   - ShadCN UI for components (cards, buttons, forms, dialogs).  
   - Maintain consistent spacing, typography, and colors.  

6. **Accessibility**  
   - Ensure proper semantic HTML (`<main>`, `<nav>`, `<section>`).  
   - Add `aria-labels`, keyboard navigation, and focus states.  

7. **Pages to Cover**
   - Landing Page  
   - Register/Login  
   - Dashboard  
   - Post Feed & Post Details  
   - New/Edit Post  
   - Chat  
   - Admin Panel  
   - Profile Page  
   - Notifications  

## ✅ Example Task Instructions
When editing, Copilot should:
- Add SEO tags in `app/layout.js`.
- Implement lazy loading for article cards in `app/posts/page.js`.
- Refactor chat UI for cleaner code inside `components/chat/`.
- Add social preview image in `app/head.js`.

---

💡 **Reminder for Copilot**:  
Do not focus only on `lib/`. Apply changes across **app, components, lib, and other relevant folders**.
