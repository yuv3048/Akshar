# Akshar — Frontend

Akshar is a modern blogging platform frontend built with **React, TypeScript, Vite, Tailwind CSS, and Hono**.

It provides authentication, Google OAuth, blog creation and management, user profiles, and responsive dark/light mode UI.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Google OAuth
- Material UI Icons
- Hono
- Cloudflare Workers

## Routes

| Route | Description |
|---|---|
| `/` | Checks authentication and redirects to `/blogs` or `/signup` |
| `/signup` | Create a new account |
| `/signin` | Sign in to an existing account |
| `/blogs` | Browse all blogs |
| `/blog/:id` | Read a specific blog |
| `/write` | Create a new blog |
| `/write/:id` | Edit an existing blog |
| `/profile` | View and manage user profile and posts |

## Backend Configuration

The frontend communicates with the deployed backend through `src/config.ts`.

```ts
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
```
## Environment Variables

Create a `.env` file in the frontend root:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_BACKEND_URL=https://backend.yuvi7341.workers.dev
```

## Deployment

**Live Website:**  
https://akshar-xi-ruddy.vercel.app

