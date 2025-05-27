import { authorise, handleRedirect } from "../utils/spotifyAuth";
import { useEffect } from "react";

export default function Login({ getPlaylists, profile, setProfile }) {
  useEffect(() => {
    // Run this only if URL has a code and we haven't handled it already
    const code = new URLSearchParams(window.location.search).get("code");

    if (code) {
      (async () => {
        try {
          const user = await handleRedirect();
          if (user) {
            setProfile(user);
            getPlaylists();
          }
        } catch (err) {
          console.error("Redirect error:", err.message);
        }
      })();
    }
  }, []);

  return (
    <div className="row py-3">
      <div className="col">
        {profile ? (
          <h3>Welcome {profile.display_name}</h3>
        ) : (
          <button className="btn btn-primary" onClick={authorise}>
            Login
          </button>
        )}
      </div>
    </div>
  );
}
