# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

TaskMaster is a multi-tenant task management app: organizations sign up, admins assign tasks to users in their org, and users check tasks off. It is two independent npm projects with no root `package.json` (the root `package-lock.json` is a stub):

- `client/` — Create React App (React 18, react-router v6, styled-components, MUI/react-bootstrap, axios, xlsx for Excel export)
- `server/` — Express + Mongoose (ES modules, `"type": "module"`), MongoDB Atlas

## Commands

Run each from its own directory (`npm install` in both). No linting or test files exist beyond CRA defaults.

```bash
# server (listens on PORT or 5000)
cd server && npm start              # node server.js
cd server && npx nodemon server.js  # dev; the "dev start" script name contains a space, so `npm run` can't invoke it

# client (localhost:3000)
cd client && npm start
cd client && npm run build
cd client && npm test               # react-scripts test (Jest); add `-- -t "name"` to filter
```

The server requires a `server/.env` (gitignored) with `CONNECTION_URL` (MongoDB URI) and `SECRET` (JWT signing key). The server only starts listening after the Mongo connection succeeds.

## Architecture

### Backend base URL is hardcoded in the client
[client/src/api/fetchpaths.jsx](client/src/api/fetchpaths.jsx) holds every API URL as an exported constant. Dev (`localhost:5000`), Heroku, and Cyclic blocks are toggled by commenting/uncommenting; currently the Cyclic prod URLs are active. To develop locally against your own server, swap the active block (and don't commit that swap by accident). The README mentions AWS Amplify/Elastic Beanstalk deployment, which is out of date relative to this file.

### Server (`server/`)
`server.js` mounts three routers: `/user`, `/tasks`, `/organizations`, each of which is `routes/*.js` → `controller/*.js` → `models/*.js`.

- **Tenancy is by string, not reference.** `User.organization` is the org *name* string; `Task.organization_id` and `Task.user_id` are also plain strings (`Task.user_id` holds the user's Mongo `_id` as a string). Task/user lookups are `GET /tasks/organization/:organization`, `GET /tasks/user/:user`, `GET /user/:organization`.
- **Auth is JWT issued at login/signup** (`userController.createToken`, 1-day expiry, signed with `SECRET`). Login returns the whole session object (`email, token, userFirstName, userLastName, isAdmin, organization, _id`), which the client stores verbatim.
- **`middleware/requireAuth.js` exists but is not applied anywhere** (`router.use(requireAuth)` in `routes/task.js` is commented out). All endpoints are currently unauthenticated, and `isAdmin` is enforced only by the client UI. Keep this in mind before assuming a route is protected.
- Signup/login validation (email format, `validator.isStrongPassword`, bcrypt hashing) lives in static methods on `userModel.js`.
- `updateUser` spreads the whole request body into `findByIdAndUpdate`, so the client must never send a plaintext `password` through it.

### Client (`client/src/`)
- **Providers** (in `index.js`): `AuthContextProvider` → `TaskContextProvider` → `App`. Auth state is restored from `localStorage["user"]` in a `useEffect`; login/signup/logout live in `hooks/useLogin|useSignup|useLogout`. `TaskContextProvider` reads `user` from auth context and, on user change, fetches the org's tasks (admin) or the user's tasks (non-admin) into a reducer (`SET_/CREATE_/DELETE_/EDIT_Tasks`). It dereferences `user.isAdmin` without a null guard, so it relies on being rendered when `user` is set/restored. `UserContext` is defined but not wired into `index.js`.
- **Routing** (`App.js`): `/`, `/signup`, `/login` redirect based on `user`; `/user` is registered only when logged in. `pages/UserHome.jsx` branches on `user.isAdmin` between `components/admin/AdminHome` and `components/user/NormalUserHome`.
- **Admin components** (`components/admin/`) fetch users of the org directly (not via context) and mutate tasks through `useTasksContext` dispatches plus API calls; Excel export (`xlsx`) is done only in `AdminDashboard`.
- Styling is styled-components per file, with `responsive.js` exporting a `mobile()` media-query helper.
- `client/static.json` (SPA fallback to `index.html`) is for static-host deployment of `client/build`.
