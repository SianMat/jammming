# Jammming

Jammming is a React web application that allows users to search for songs using the Spotify Web API, create custom playlists, and save them directly to their Spotify account.

This project was built as part of Codecademy's _Front-End Engineer Career Path_ and demonstrates:

- OAuth authentication
- State management using React hooks
- Interaction with a third-party API

---

## Features

- Spotify Authentication (OAuth with PKCE)
- Search for tracks by keyword
- Build and edit custom playlists
- Save playlists to your Spotify account
- Rename and delete playlists

---

## Tech Stack

- **React** (with Hooks)
- **Spotify Web API**
- **Vite**
- **PKCE OAuth Flow**

---

## Getting Started

### Prerequisites

- A [Spotify Developer Account](https://developer.spotify.com/dashboard)
- Node.js and npm installed

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/jammming.git
   cd jammming
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a .env file in the root directory with the following content:

   ```env
   VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
   VITE_REDIRECT_URI=http://localhost:5173
   ```

   Ensure your redirect URI is listed in your Spotify Developer Dashboard.

4. **Start the development server**

   ```bash
   npm run dev
   ```

## Learning Objectives

- Use `fetch` to communicate with APIs
- Authenticate using OAuth (PKCE)
- Manage application state with React hooks
- Build modular, reusable components in React
- Handle asynchronous data fetching and error states

## Known Limitations

- No Spotify playback functionality
- Refresh tokens are not implemented
- Application state is not persistent across reloads

## License

This project is intended for educational use as part of the Codecademy curriculum. It is not affiliated with Spotify in any way.
