# AnantaKatha Frontend Documentation

## 1. Project Overview

AnantaKatha is a React + Vite frontend for a storytelling platform. The app supports:

- story discovery and reading
- story generation and editing
- author profile management
- admin moderation and analytics
- authentication and account recovery
- legal and privacy pages

The frontend is built as a static single-page application and talks to the backend API over HTTPS.

## 2. Tech Stack

- React 18
- Vite
- React Router
- Axios
- Redux Toolkit
- React Hook Form
- Zod

## 3. High-Level Architecture

The data flow is:

1. User opens a page in the browser.
2. React Router renders the correct page component.
3. The page calls an API module in `src/api/`.
4. The shared Axios client in `src/api/client.js` adds auth headers and CSRF headers when needed.
5. The backend responds with JSON.
6. The UI renders the response and stores session data in localStorage where needed.

The frontend is static, so deployment is a build-and-upload process.

## 4. Important Frontend Files

- `src/main.jsx` - React entry point
- `src/App.jsx` - route definitions
- `src/api/client.js` - Axios client, auth, CSRF, refresh handling
- `src/api/*.js` - feature-specific API wrappers
- `src/store/` - Redux auth state
- `src/pages/` - page-level UI
- `src/components/` - shared UI components
- `src/styles/global.css` - app-wide styling
- `public/_redirects` - Cloudflare Pages SPA fallback

## 5. API Integration

### 5.1 Base URL

The API base URL is controlled by `VITE_API_URL`.

Current behavior in `src/api/client.js`:

- if `VITE_API_URL` exists, use it
- otherwise, use `https://api.anantakatha.in/api/v1` in production
- otherwise, use `http://localhost:5000/api/v1` in development

### 5.2 Authentication

The frontend uses bearer auth and refresh tokens:

- access token is stored in `localStorage`
- refresh token is stored in `localStorage`
- Axios adds `Authorization: Bearer <token>` automatically
- if a request returns `401`, the client tries `POST /auth/refresh-token`
- if refresh succeeds, the original request is retried

### 5.3 CSRF Protection

For mutating requests (`POST`, `PUT`, `PATCH`, `DELETE`), the client:

1. calls `GET /security/csrf-token`
2. reads the token from the response
3. sends it as `x-csrf-token`

This means the backend must support:

- cookie-based session setup for CSRF
- `withCredentials: true`
- a valid CSRF token endpoint
- matching CORS configuration

### 5.4 API Modules

The app keeps API calls separated by feature:

- `src/api/auth.js`
- `src/api/users.js`
- `src/api/stories.js`
- `src/api/admin.js`
- `src/api/ai.js`
- `src/api/analytics.js`

This makes the frontend easier to maintain and keeps network logic out of page components.

## 6. Security Model

### 6.1 Transport Security

Production runs over HTTPS:

- frontend: `https://anantakatha.in`
- backend: `https://api.anantakatha.in/api/v1`

All API traffic should stay on HTTPS only.

### 6.2 CORS

The backend must allow the frontend origin explicitly.

Required behavior:

- allow origin `https://anantakatha.in`
- allow credentials
- allow headers like `Authorization`, `Content-Type`, and `x-csrf-token`

### 6.3 Cookies and Sessions

For production, the backend should use secure session cookies:

- `Secure: true`
- `SameSite: Lax` or an equivalent safe setting
- cookies only over HTTPS

### 6.4 LocalStorage

The app stores auth tokens in localStorage.

Notes:

- localStorage is convenient for SPA auth
- it should not store secrets that must remain server-only
- if XSS exists, localStorage tokens can be exposed, so the frontend must stay sanitized and dependency-safe

### 6.5 Public and Protected Routes

The app separates public and protected areas:

- public pages: home, published stories, login, signup, privacy, terms
- protected pages: dashboard, profile, story editor, admin tools

Authenticated users are redirected away from public auth pages.

## 7. Privacy Considerations

The frontend includes privacy-related pages and patterns:

- Privacy Policy
- Terms and Conditions
- User Data Policy
- account export page
- delete account page

Important privacy practices:

- keep only non-secret values in Vite env files
- do not put private API keys in frontend code
- treat any `VITE_` variable as public because it ships into the browser bundle
- use HTTPS and secure cookies for all authenticated traffic
- minimize data shown on public pages

## 8. Local Development Setup

### 8.1 Prerequisites

- Node.js installed
- npm installed
- backend API running locally or reachable remotely

### 8.2 Install Dependencies

```bash
npm install
```

### 8.3 Local Environment File

Create or update `.env` in the project root:

```bash
VITE_API_URL=http://localhost:5000/api/v1
```

### 8.4 Run the Dev Server

```bash
npm run dev
```

The Vite app usually runs at:

- `http://localhost:5173`

### 8.5 Build Locally

```bash
npm run build
```

### 8.6 Preview the Production Build

```bash
npm run preview
```

## 9. Cloudflare Pages Deployment with CLI

This project is deployed as a static site on Cloudflare Pages.

### 9.1 Why Cloudflare Pages

- free static hosting tier
- free HTTPS
- fast global CDN
- custom domain support
- simple CLI deployment

### 9.2 Required Files

The project already includes:

- `public/_redirects` with `/* /index.html 200`

That file is important because React Router needs all routes to resolve to `index.html`.

### 9.3 Install Wrangler

Use Wrangler 3 if you are on Node 18:

```bash
npx wrangler@3 --version
```

If you already have Node 20+, Wrangler 4 can also work, but Wrangler 3 is safer for this environment.

### 9.4 Log In to Cloudflare

```bash
npx wrangler@3 login
```

This opens a browser-based OAuth login flow.

### 9.5 Create the Pages Project

```bash
npx wrangler@3 pages project create anantakatha-frontend --production-branch main
```

Run this once if the Pages project does not already exist.

### 9.6 Build the Frontend

```bash
npm run build
```

This creates the `dist/` folder.

### 9.7 Deploy to Cloudflare Pages

```bash
npx wrangler@3 pages deploy dist --project-name anantakatha-frontend
```

When the deploy succeeds, Cloudflare gives you a `pages.dev` URL.

### 9.8 Add the Custom Domain

After the first deployment:

1. Open the Cloudflare dashboard.
2. Open the Pages project.
3. Add the custom domain `anantakatha.in`.
4. Add `www.anantakatha.in` if needed.
5. Let Cloudflare finish DNS and SSL provisioning.

### 9.9 Set Production Environment Variables in Cloudflare Pages

In the Cloudflare Pages project settings, set:

```bash
VITE_API_URL=https://api.anantakatha.in/api/v1
```

This ensures the deployed frontend always points to the live API.

## 10. Cloudflare Deployment Checklist

Before going live:

1. Confirm the backend is reachable at `https://api.anantakatha.in/api/v1`.
2. Confirm CORS allows `https://anantakatha.in`.
3. Confirm cookies are marked `Secure` in production.
4. Confirm CSRF token generation works.
5. Confirm the frontend build passes.
6. Confirm `public/_redirects` is present.
7. Confirm the custom domain is attached in Cloudflare Pages.

## 11. Troubleshooting

### 11.1 Frontend Calls localhost in Production

Cause:

- `VITE_API_URL` is missing or outdated in the production build

Fix:

- update Cloudflare Pages env vars
- rebuild and redeploy

### 11.2 Invalid CSRF Token

Cause:

- cookie and origin mismatch
- backend not setting the CSRF token correctly
- incorrect CORS or cookie settings

Fix:

- confirm `withCredentials: true`
- confirm backend sends the CSRF token endpoint
- confirm backend allows the frontend origin

### 11.3 Route Refresh Returns 404

Cause:

- SPA fallback missing on static hosting

Fix:

- keep `public/_redirects` with `/* /index.html 200`

### 11.4 SSL or Domain Problems

Cause:

- wrong DNS target
- stale records
- domain not attached in Cloudflare Pages

Fix:

- remove conflicting old DNS records
- attach the domain inside the Pages project
- wait for SSL provisioning

## 12. Useful Commands

```bash
npm install
npm run dev
npm run build
npm run preview
npx wrangler@3 login
npx wrangler@3 pages project create anantakatha-frontend --production-branch main
npx wrangler@3 pages deploy dist --project-name anantakatha-frontend
```

## 13. Summary

The frontend is a static React application with secure API integration, CSRF support, authenticated routes, and Cloudflare Pages deployment.

The most important production requirements are:

- correct API base URL
- HTTPS on both frontend and backend
- backend CORS and cookies configured for credentials
- CSRF token flow enabled
- Cloudflare Pages SPA fallback enabled
