// app/components/SpotifyProfile.tsx
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
  }, [isSignedIn]);

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
        <p className="text-lg font-medium text-gray-700">
          Please sign in to view your Spotify profile.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
        <p className="text-lg font-medium text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
        <p className="text-lg font-medium text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Spotify Profile</h1>
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-center mb-4">
          {profile.images && profile.images.length > 0 ? (
            <img
              src={profile.images[0]?.url}
              alt="Profile"
              className="rounded-full border border-gray-300"
              width={100}
              height={100}
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>
        <p className="text-xl font-semibold text-gray-800 mb-2">
          Name: {profile.display_name}
        </p>
        <p className="text-lg text-gray-600 mb-2">Email: {profile.email}</p>
        <p className="text-lg text-gray-600 mb-2">Country: {profile.country}</p>
        <p className="text-lg text-gray-600 mb-2">Product: {profile.product}</p>
        <p className="text-lg text-gray-600 mb-2">
          Followers: {profile.followers.total}
        </p>
        <p className="text-lg text-gray-600">Spotify ID: {profile.id}</p>
      </div>
    </div>
  );
};

export default SpotifyProfile;
