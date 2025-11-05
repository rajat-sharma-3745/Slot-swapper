# Slot Swapper (rajat-sharma-3745-slot-swapper)

**A lightweight slot/event swapping application** — SlotSwapper is a peer-to-peer time-slot scheduling application built using the MERN stack (MongoDB, Express, React, Node.js).
It allows users to manage their calendars, mark busy slots as swappable, and exchange time slots with other users seamlessly.

---

## Table of contents

* [Overview](#overview)
* [Design choices](#design-choices)
* [Prerequisites](#prerequisites)
* [Setup & run (step-by-step)](#setup--run-step-by-step)

  * [Backend](#backend)
  * [Frontend](#frontend)
* [Environment variables](#environment-variables)
* [API endpoints](#api-endpoints)
* [Challenges & notes](#challenges--notes)

---

## Overview

This project implements a simple system where users can create/manage events (time slots), post swap requests, browse marketplace requests, and accept/decline swap proposals. It is split into two parts:

* **Backend/** — Express API that manages users, events, and swap requests; connects to MongoDB.
* **Frontend/** — React application (Vite) with pages for login, dashboard, marketplace and requests.



---

## Design choices

* **REST API**: Clear separation of resources (`/api/users`, `/api/events`) so frontend and third-party clients can integrate easily.
* **JWT Authentication**: Token-based auth for protected routes (middleware in `middlewares/auth.js`).
* **Mongoose models**: `User`, `Event`, `SwapRequest` (structured under `models/`), keeping DB logic separate from controllers.
* **Async handler & central error handler**: Utilities (`utils/asyncHandler.js`, `utils/errorHandler.js`) to keep controllers concise and standardize errors.
* **Frontend with Context**: `Context/AppContext.jsx` centralizes auth and app state for the UI.
* **Lightweight UI stacks**: Vite + React, minimal dependencies so reviewers can run quickly.

---

## Prerequisites

* Node.js (v16+ recommended)
* npm (or yarn)
* MongoDB (cloud Atlas or local instance)

---

## Setup & run (step-by-step)

> Follow both backend and frontend steps to run the app locally.
## Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/SlotSwapper.git
cd SlotSwapper
```

### Backend

1. Open a terminal and `cd` into the backend folder:

```bash
cd rajat-sharma-3745-slot-swapper/Backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in `Backend/` (see **Environment variables** below). Example:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

4. Run the server in development (common scripts):

* If the repository has a `dev` script (e.g. using `nodemon`):

```bash
npm start
```

* Otherwise start directly with Node:

```bash
node server.js
```

The backend typically listens on port `3000` (or the port set in `.env`).

### Frontend

1. Open a separate terminal and `cd` into the frontend folder:

```bash
cd rajat-sharma-3745-slot-swapper/Frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the Vite dev server:

```bash
npm run dev
```

By default Vite serves the app on `http://localhost:5173/` (or the port shown in the terminal). Ensure the frontend's `axiosInstance.js` uses the backend base URL (e.g., `http://localhost:3000/api`) 

---


## API endpoints

Below is a concise list of main endpoints. Adjust paths if your route files have different base paths. All endpoints that change state or return user-specific data require a valid token which is being sent in cookie.

| Purpose                      | Method | Path                            | Authentication   | Body / Notes                                                   |  
| ---------------------------- | ------ | ------------------------------- | ---------------- | -------------------------------------------------------------- |
| Register user                | POST   | `/api/users/signup`             | No               | `{ name, email, password }` → Returns `userInfo` & `{ token }` | 
| Login user                   | POST   | `/api/users/login`              | No               | `{ email, password }` → Returns `userInfo` & `{ token }`       | 
| Create event                 | POST   | `/api/events`                   | Yes              | `{ title, startTime, endTime }`                                | 
| Get all events               | GET    | `/api/events`                   | Yes              | –                                                              |
| Update event                 | PUT    | `/api/events/:id`               | Yes (owner only) | `{ status }`                                                   | 
| Create swap request          | POST   | `/api/swap-request`             | Yes              | `{ mySlotId, theirSlotId }`                                    | 
| Get swap requests (user)     | GET    | `/api/swap-requests`            | Yes              | Returns swap requests where user is requester/owner            | 
| Get marketplace swaps        | GET    | `/api/swappable-slots`          | Yes              | List of open swap requests (available to browse)               | 
| Update swap (accept/decline) | PUT    | `/api/swap-response/:requestId` | Yes              | `{ status: 'accepted' ,'declined' ,'cancelled' }`              |    



---


## Assumptions & decisions

* Authentication is JWT-based and tokens are sent in the `Cookies`.
* MongoDB + Mongoose is used for persistence (models found in `Backend/models/`).
* The frontend expects endpoints under `/api/*` — confirm or update `Frontend/src/utils/apiPaths.js` or `axiosInstance.js` if you change base URLs.


---

## Challenges & notes



* **Calendar Grid Rendering**:
Mapping events dynamically to correct date cells and making sure multiple events appear clearly within a day’s box without breaking layout.

* **State Synchronization**:
After an event is made swappable or a swap is accepted/rejected, keeping the frontend state in sync with backend updates without page reloads.

* **Modal Management**:
Handling pop-up modals (for “Make Swappable” and “Request Swap”) smoothly while preserving user context.

* **Data Visualization Simplicity**:
Balancing between simplicity and clarity when showing event statuses (BUSY, SWAPPABLE, SWAP_PENDING) with distinct colors and hover effects.

---

