# QuantumDesk Frontend Notes

## Overview
- Next.js App Router in `src/app`.
- ShadCN UI components under `src/components/ui`.
- API helper consolidated in `src/lib/api.js` with safe fetch + socket.io.

## Recent Changes
- Fixed build errors and cleaned layouts:
  - Corrected invalid `<dev>` tag in `(public)/layout.jsx`.
  - Fixed root `metadata` image URLs in `src/app/layout.jsx`.
  - Ensured `<html lang="en">` and favicon link present.
- API alignment with backend README routes:
  - Added `auth.update(payload)` -> `PUT /api/auth/update`.
  - Added `users.updateMe(payload)` -> `PUT /api/users/me`.
- Settings forms now use API helper and ShadCN `Button`:
  - `PreferencesForm.jsx` uses `api.auth.update`.
  - `ProfileInfo.jsx` uses `api.auth.getProfile` + `api.users.updateMe`.
  - `SecurityForm.jsx` uses `api.auth.update` for password change.
- Landing page now includes an accessible `<h1>`.

## UI Components (ShadCN)
- Buttons replaced with `@/components/ui/button` in settings forms.
- Other available UI primitives in `src/components/ui`: `card`, `input`, `textarea`, `tabs`, `dropdown-menu`, etc.

## API Base URL
- Set via `process.env.NEXT_PUBLIC_API_BASE`.
- Alternatively call `api.setBaseURL(url)` at app bootstrap if needed.

## Backend Routes Mapping
- Auth: `/api/auth/login`, `/api/auth/register`, `/api/auth/update`.
- Users: `/api/users/me`, `/api/users/:id`, follow/unfollow, update/delete.
- Posts: list/get/create/update/delete, like, comments list/add/edit/delete.
- Chats/Messages/Notifications per backend README.

## Realtime
- Use `api.initRealtime()` after login. Subscribe with `api.subscribe(event, handler)`.

## Dev Commands
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Start: `npm start`

## Notes
- Images: domains allowed via `next.config.mjs` (`cloudinary`, `unsplash`).
- Tailwind v4 configured in `src/app/globals.css` and `postcss.config.mjs`.
