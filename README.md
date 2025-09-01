🎬 Movies Client (React + TypeScript + Vite)

This is the frontend for the Movies application.
It consumes the Django REST API to manage movies 🎥 and reviews 💬, with authentication handled via tokens.

🚀 Tech Stack

React
 + Vite
 ⚡

TypeScript

Axios
 for HTTP requests

Tailwind CSS
 for styling

Context API (AuthProvider) for authentication state

React Hooks (useState, useEffect) for state management

📂 Project Structure
movies-client/
 ├── src/
 │    ├── api/             # API services (auth, movies, reviews)
 │    ├── components/      # UI components (e.g. MovieCard)
 │    ├── context/         # AuthProvider (user + token handling)
 │    ├── pages/           # Pages (Movies, etc.)
 │    ├── types/           # TypeScript types
 │    └── main.tsx         # Entry point
 ├── public/               # Static assets
 ├── index.html            # Main HTML file
 ├── package.json
 ├── tsconfig.json
 └── vite.config.ts

⚙️ Installation

Go to the client folder:

cd movies-client


Install dependencies:

npm install


Create a .env file in the project root:

VITE_API_BASE=http://127.0.0.1:8000/api


Adjust the URL if your Django backend runs elsewhere.

▶️ Available Scripts

Development (hot reload):

npm run dev


Opens at http://localhost:5173

Production build:

npm run build


Preview production build:

npm run preview

🔐 Authentication Flow

Login and register endpoints are consumed from the backend (/auth/login/, /auth/register/).

The token is stored in localStorage.

api.ts automatically injects the token in all requests:

Authorization: Token <your_token>

📝 Features

📂 List all movies from the API

➕ Add new movies (with poster upload via FormData)

🗑 Delete movies (only if logged in)

💬 Add / edit / delete reviews

🔒 Authentication with login / register / logout
