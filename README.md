# Running Friends Frontend

Running Friends is a social app for runners to share updates, post photos from runs, and stay connected with friends or the wider running community. This frontend is built with React, Vite, and Bootstrap styling, and it integrates with a backend API and Supabase for authentication and media uploads.

## Overview

The app lets users:

- sign up and log in
- authenticate with Google OAuth
- create public or friends-only running updates
- upload a run photo to the backend and show it in the feed
- view a community feed and personal profile information
- log out and maintain a token-based session

## Tech Stack

- React 19
- Vite
- React Router
- Bootstrap 5
- Supabase JS SDK
- Vitest + Testing Library

## Project Structure

```bash
running-frontend/
├── public/
│   └── running-social-mark.svg
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── helper/
│   ├── pages/
│   ├── tests/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the frontend root and add your Supabase variables:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

These values are used by the auth provider for Google login and session handling.

### 3. Start the app locally

```bash
npm run dev
```

Then open the local Vite URL shown in the terminal, usually:

```bash
http://localhost:5173
```

## Available Scripts

```bash
npm run dev      # start the Vite dev server
npm run build    # create a production build
npm run preview  # preview the production build locally
npm run lint     # run ESLint
npm test         # run the Vitest test suite
```

## App Flow

### Authentication

The app uses a token-based auth flow through the backend. The auth provider handles:

- email sign up
- email log in
- OAuth redirect to Supabase
- backend token exchange for app sessions
- automatic logout on 401 responses

### Feed and posting

The main feed page allows users to:

- enter a title and update text
- choose visibility: Public or Friends-only
- optionally attach an image
- publish the post to the backend
- see newly created posts appear live after refresh

When an image is selected, the frontend creates a FormData payload and sends it to the backend. The backend uploads the file to Supabase Storage and stores the public URL in the post record.

### Routing

Key routes include:

- `/login`
- `/signup`
- `/feed`
- `/profile`
- `/auth/callback`

## Backend Dependency

This frontend expects a running backend API to be available. The app points at the backend in `src/helper/endpoints.js`, so if you are working locally you may need to update the `BASE_URL` to your local backend host.

Example:

```js
const BASE_URL = "http://localhost:3000";
```

The backend is responsible for:

- user auth
- creating posts
- media upload handling
- friend/follow relationships
- returning feed data

## Development Notes

- The feed uses `FormData` when an image is present.
- The app avoids sending a JSON `Content-Type` for multipart uploads so the backend can accept uploaded files correctly.
- The public URL returned from Supabase is used for image rendering in the feed.

## Testing

This project includes frontend tests for login and feed behavior. They use mocked API requests rather than a live backend so they can run in isolation.

```bash
npm test
```

## Production Build

To create a production build:

```bash
npm run build
```

Then serve the generated output with a static host or deploy it to your preferred frontend platform.

## Notes

This frontend is designed to work alongside the companion backend project and Supabase configuration for storage and auth. If you are setting up the project from scratch, make sure both the backend and Supabase storage bucket are configured before using the upload feature.

## License

This project is for local development and personal project use unless otherwise specified by the repository owner.
