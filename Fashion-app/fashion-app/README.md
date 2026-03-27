<div align="center">

# DRSSED — Fashion App

Custom Ghanaian fashion marketplace built with React, Vite, Tailwind CSS, and Firebase.

</div>

## ✨ Highlights

- Animated splash screen that routes users into the experience within seconds.
- Story-driven landing page describing the value props (custom designs, expert tailors, measurement uploads, secure chat).
- Authentication flow with email/password, Google, and Facebook sign-up, plus role selection for `Customer` or `Designer`.
- Form validation, error surfacing, and Firestore profile creation in one cohesive UX.
- Responsive Tailwind-driven layout with reusable design tokens defined in `tailwind.config.js`.

## 🧱 Tech Stack

- React 19 + React Router 7 for routing between `Splash`, `Landing`, `Login`, and `Signup` screens.
- Vite 7 for lightning-fast dev/build cycles.
- Tailwind CSS 3 for utility-first styling with custom colors (`primary`, `teal`, etc.).
- Firebase (Auth + Firestore) for identity, OAuth providers, and profile storage.
- Iconography via `lucide-react` and `react-icons`.

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 10 (ships with recent Node releases)

### Installation

```bash
git clone <repo-url>
cd fashion-app/fashion-app
npm install
```

### Environment configuration

Update `src/firebase.js` with your own Firebase project keys. For production use, prefer environment variables:

```bash
cp .env.example .env.local  # create this file if it does not exist
```

Then populate values such as `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, etc., and reference them inside `src/firebase.js`.

### Run the app

```bash
npm run dev
```

The Vite dev server prints a local URL (typically http://localhost:5173). The splash screen automatically navigates to the landing page after ~2.5 seconds.

## 📜 Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with hot module reload. |
| `npm run build` | Generate a production build in `dist/`. |
| `npm run preview` | Serve the built assets locally to verify production output. |
| `npm run lint` | Run ESLint using the project rules. |

## 📁 Project Structure

```
fashion-app/
├── public/
├── src/
│   ├── App.jsx              # Router entry, maps routes to pages
│   ├── firebase.js          # Firebase initialization (Auth + Firestore)
│   ├── main.jsx             # React bootstrap + Tailwind styles
│   ├── pages/
│   │   ├── Splash.jsx       # Animated intro + auto redirect
│   │   ├── Landing.jsx      # Marketing content + CTA buttons
│   │   ├── Login.jsx        # Basic email/password login UI
│   │   └── Signup.jsx       # Full registration flow w/ providers
│   └── index.css            # Tailwind base layers + custom styles
├── tailwind.config.js       # Custom color palette + animations
└── vite.config.js           # Vite + React plugin configuration
```

## 🔐 Authentication Flow

1. Users choose between `Customer` or `Designer` roles.
2. Email/password sign-up validates required fields and matching passwords.
3. Social sign-up buttons call `signInWithPopup` using Google or Facebook providers.
4. Profiles (name, email, phone, role, timestamps) are persisted to Firestore via `saveUserProfile()`.

## 🛣️ Roadmap Ideas

- Persist auth state globally and protect designer-only routes.
- Replace inline Firebase keys with secured environment variables and CI secrets.
- Add measurement uploads, order tracking, and designer chat threads.
- Integrate analytics or crash reporting (Firebase Analytics, Sentry, etc.).

## 🤝 Contributing

1. Fork the repo and create a feature branch.
2. Run `npm run lint` before pushing to keep the codebase consistent.
3. Open a pull request with context, screenshots, and testing notes.

## 📄 License

Add your preferred license (e.g., MIT) here. If unsure, keep the repo private until licensing is finalized.
