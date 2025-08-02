#  Instagram Clone (Vite + React)

A fast and modern **Instagram clone** built using **Vite** and **React**, integrating real-world APIs like **Pexels**, and custom APIs for profile and user data using environment variables.

---

## 🚀 Features

- 📹 Reels section with scroll-based autoplay and mute behavior
- 📖 Stories with Instagram-style tap-to-pause/resume
- 💬 Messaging interface with mock chat UI
- 🧑‍💼 User profiles and avatars loaded from external API
- 📸 Video content from Pexels API
- ⚙️ Configurable data sources via `.env` variables
- 🧭 Routing with `react-router-dom`
- 🎨 FontAwesome icons and responsive design

---

## 🧰 Tech Stack

- **Vite** — lightning-fast frontend tool
- **React** — UI rendering
- **React Router DOM** — client-side routing
- **FontAwesome** — icons
- **Axios / Fetch** — for API calls
- **CSS Modules / Plain CSS** — for styling
- **Pexels API** — for video content
- **Custom APIs** — for user and profile data

---

## 📂 Project Structure

```

src/
├── assets/              # Static assets (images, icons)
├── components/          # Reusable components (e.g., Reels, Story, Message)
├── data/
│   ├── dataLoader.js    # Loads data from APIs
│   └── constants.js     # Static keywords or config
├── App.jsx              # Main app component
├── main.jsx             # Vite's entry point
└── index.css            # Global styles

````

---

## 🌐 API Integration

### 🔹 Pexels API

Used to fetch high-quality short videos:

- Sign up for an API key at [pexels.com/api](https://www.pexels.com/api/)
- Add the key to your `.env` file:

```env
VITE_PEXELS_API_KEY=your_pexels_api_key
````

---

### 🔹 Custom Profile & User Data

You can configure your own API endpoints for loading user profiles and avatars:

```env
VITE_PROFILE_DATA_URL=https://yourdomain.com/profiles.json
VITE_USER_API=https://yourdomain.com/users.json
```

Use these endpoints to feed dynamic user and profile data into the app.

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/instagram-clone.git
cd instagram-clone
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
VITE_PEXELS_API_KEY=your_pexels_api_key
VITE_PROFILE_DATA_URL=https://yourdomain.com/profiles.json
VITE_USER_API=https://yourdomain.com/users.json
```

### 4. Start development server

```bash
npm run dev
```

---

## 📦 Build for production

```bash
npm run build
npm run preview
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Credits

* [Pexels](https://pexels.com/)
* [Vite](https://vitejs.dev/)
* [React](https://reactjs.org/)