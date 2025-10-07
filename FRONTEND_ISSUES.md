# QuantumDesk Frontend Issues

## Open Questions / Pending Backend Endpoints
- Moderation endpoints noted in backend README are not implemented yet (`controllers/moderationController.js`). Any frontend usage of moderation should be gated/disabled until backend is ready.

## CORS / ENV
- Ensure `.env` contains `NEXT_PUBLIC_API_BASE` pointing to backend base URL (e.g., `http://localhost:5000`).
- If non-GET requests fail with `TypeError: Failed to fetch`, check backend CORS config and allow credentials.

## Reproduce Steps
1. Set `NEXT_PUBLIC_API_BASE` in frontend `.env.local`.
2. Start backend on `PORT=5000`.
3. Run `npm run dev` in frontend.
4. Login and test posts list and comments. If comments do not appear in realtime, confirm Socket.io is enabled and `FRONTEND_URL` matches origin.

## Known Gaps
- No explicit preferences route in backend spec; `PreferencesForm` currently posts to `PUT /api/auth/update` with `{ lang, theme }`. If backend requires a different route/schema, update `api.auth.update` usage accordingly.

