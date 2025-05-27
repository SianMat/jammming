// spotify.js
export async function authorise() {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  redirectToAuthCodeFlow(clientId);
}

export async function handleRedirect() {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) return null;

  const accessToken = await getAccessToken(clientId, code);
  const profile = await fetchProfile(accessToken);

  // Optional: store token if needed
  localStorage.setItem("spotify_access_token", accessToken);

  // Optional: clear code from URL
  window.history.replaceState({}, document.title, "/");

  return profile;
}

export async function redirectToAuthCodeFlow(clientId) {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", import.meta.env.VITE_REDIRECT_URI);
  params.append("scope", "user-read-private user-read-email");
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);
  params.append(
    "scope",
    "playlist-modify-public playlist-modify-private user-read-private user-read-email playlist-read-private"
  );

  window.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length) {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((x) => possible[x % possible.length])
    .join("");
}

async function generateCodeChallenge(verifier) {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function getAccessToken(clientId, code) {
  const verifier = localStorage.getItem("verifier");

  if (!verifier) {
    throw new Error("Missing code verifier. Please try logging in again.");
  }

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", import.meta.env.VITE_REDIRECT_URI);
  params.append("code_verifier", verifier);

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_description || "Failed to fetch token");
  }

  return data.access_token;
}

async function fetchProfile(token) {
  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
