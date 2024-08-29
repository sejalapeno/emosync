"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

const SpotifyProfile = () => {
  const { isSignedIn } = useAuth(); // Clerk hook to check authentication state
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpotifyProfile = async () => {
      try {
        const response = await fetch("/api/spotify");
        const data = await response.json();

        if (response.ok) {
          setProfile(data.message);
        } else {
          setError(data.message || "Failed to fetch Spotify profile");
        }
      } catch (err) {
        setError("An error occurred while fetching Spotify profile");
      }
    };

    if (isSignedIn) {
      fetchSpotifyProfile();
    }
  }, [isSignedIn]); // Ensure this effect only runs if the user is signed in

  if (!isSignedIn) {
    return <div>Please sign in to view your Spotify profile.</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Spotify Profile</h1>
      <p>Name: {profile.display_name}</p>
      <p>Email: {profile.email}</p>
      {profile.images && profile.images.length > 0 && (
        <img src={profile.images[0]?.url} alt="Profile" width={100} />
      )}
    </div>
  );
};

export default SpotifyProfile;
