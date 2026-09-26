# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

TaskMaster is a multi-tenant task management app: organizations sign up, admins assign tasks to users in their org, and users check tasks off. It is two independent npm projects (`client/`, `server/`) plus a small root `package.json` whose only job is the Railway `build`/`start` scripts (the root `package-lock.json` is a stub):

- `client/` — Create React App (React 18, react-router v6, styled-components, MUI/react-bootstrap, axios, xlsx for Excel export)
- `server/` — Express + Mongoose (ES modules, `"type": "module"`), MongoDB on Railway

## Commands

Run each from its own directory (`npm install` in both). No linting or test files exist beyond CRA defaults.

```bash
# server (local API on PORT from server/.env; use 5001 because macOS uses 5000 for AirPlay)
cd server && npm start              # node server.js
cd server && npm run dev            # nodemon

# client (localhost:3000, proxies /api to localhost:5001 via "proxy" in client/package.json)
cd client && npm start
cd client && npm test               # react-scripts test (Jest); add `-- -t "name"` to filter

# production build, run from the repo root (what Railway runs)
npm run build                       # installs + builds client, installs server
npm start                           # node server/server.js serves API and client/build on PORT
```

The server requires a `server/.env` (gitignored) with `CONNECTION_URL` (MongoDB URI) and `SECRET` (JWT signing key). The server only starts listening after the Mongo connection succeeds.

## Deployment

Hosted on Railway (project `taskmaster`, personal workspace) as two services: the app (`taskmaster-app`, deployed from GitHub `main`, auto-redeploys on push) and a MongoDB service (`mongo:8.0`). The app reaches Mongo over Railway's private network via `CONNECTION_URL=${{MongoDB.MONGO_URL}}/taskMasterUSA?authSource=admin`. Live at https://taskmaster.margotticode.com (custom domain: CNAME `taskmaster` -> the Railway target plus a `_railway-verify.taskmaster` TXT record, both set at Bluehost, which hosts the `margotticode.com` DNS; the Railway address `taskmaster-app-production-5e8e.up.railway.app` also works). Demo logins: `demo@gmail.com` (admin) and `mike@gmail.com`, password `Password123!`. The old Atlas cluster no longer exists and its data was not migrated. To connect from a local machine, the Mongo service needs a public TCP proxy (the private domain is not reachable); remove it when not needed.

## Architecture

### Single-service deployment
Express serves both the API and the built React app, so the client uses relative API paths ([client/src/api/fetchpaths.jsx](client/src/api/fetchpaths.jsx), all under `/api`) with no hardcoded backend URL. The API is mounted under `/api` (not at the root) so it does not collide with React routes such as `/user`. Anything else that is not a static file falls back to `client/build/index.html` for client-side routing.

### Server (`server/`)
`server.js` mounts three routers: `/api/user`, `/api/tasks`, `/api/organizations`, each of which is `routes/*.js` → `controller/*.js` → `models/*.js`.

- **Tenancy is by string, not reference.** `User.organization` is a string; `Task.organization_id` and `Task.user_id` are also plain strings (`Task.user_id` holds the user's Mongo `_id` as a string). Task/user lookups are `GET /api/tasks/organization/:organization`, `GET /api/tasks/user/:user`, `GET /api/user/:organization`. In practice `User.organization` holds the Organization document's `_id` as a string (set by `orgSignup`), and the client uses it to fetch the org name. `server.js` also sets a `Strict-Transport-Security` header so browsers upgrade the custom domain to HTTPS after the first secure visit. A middleware in `server.js` collapses duplicate slashes because the client builds some URLs like `/api/tasks//organization/x`.
- **Auth is JWT issued at login/signup** (`userController.createToken`, 1-day expiry, signed with `SECRET`). Login returns the whole session object (`email, token, userFirstName, userLastName, isAdmin, organization, _id`), which the client stores verbatim.
- **Authorization is enforced server-side** by `middleware/requireAuth.js` (verifies the Bearer token, loads `{_id, organization, isAdmin}` from the DB into `req.user`) and its `requireAdmin` companion. Only `POST /api/user/login` and `POST /api/organizations/signup` are public. Every controller scopes queries to `req.user.organization`; regular users can read only themselves and their own tasks and can only toggle `isComplete` on their own tasks; admins manage users/tasks in their own org only. The organization on signup/create requests is taken from the token, never the request body.
- Signup/login validation (email format, `validator.isStrongPassword`, bcrypt hashing) lives in static methods on `userModel.js`.
- `updateUser` whitelists `first_name, last_name, email, isAdmin`; passwords and `organization` cannot be changed through it. `userModel` strips `password` from all JSON output via a `toJSON` transform, so never rely on `select("-password")`, but never remove that transform either.

### Client (`client/src/`)
- **Providers** (in `index.js`): `AuthContextProvider` → `TaskContextProvider` → `App`. Auth state is restored from `localStorage["user"]` in a `useEffect`; `api/authInterceptors.js` (imported in `index.js`) wraps `window.fetch` and axios so every same-origin `/api` request automatically carries `Authorization: Bearer <token>`; login/signup/logout live in `hooks/useLogin|useSignup|useLogout`. `TaskContextProvider` reads `user` from auth context and, on user change, fetches the org's tasks (admin) or the user's tasks (non-admin) into a reducer (`SET_/CREATE_/DELETE_/EDIT_Tasks`). It refetches whenever `user` changes and clears the tasks when `user` is null (logout / before `localStorage` is restored). `UserContext` is defined but not wired into `index.js`.
- **Routing** (`App.js`): `/`, `/signup`, `/login` redirect based on `user`; `/user` is registered only when logged in. `pages/UserHome.jsx` branches on `user.isAdmin` between `components/admin/AdminHome` and `components/user/NormalUserHome`.
- **Admin components** (`components/admin/`) fetch users of the org directly (not via context) and mutate tasks through `useTasksContext` dispatches plus API calls; Excel export (`xlsx`) is done only in `AdminDashboard`; its two export functions map records to the same readable columns as the on-screen tables (names, formatted dates, no database ids), so keep them in sync when table columns change.
- Styling is styled-components per file, with `responsive.js` exporting a `mobile()` media-query helper.

## Portfolio card

The end of `README.md` has a hidden JSON block (between `portfolio-card:start` and `portfolio-card:end`, inside an HTML comment) used by a portfolio site, plus a screenshot at `docs/preview.jpg`. Keep it in sync when features, tech or URLs change, and keep it valid JSON with no `--` sequences.
