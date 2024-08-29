// app/api/createPlaylist/route.ts

import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Mapping of emotions to genres
const emotionToGenre: { [key: string]: string[] } = {
  Happy: ["pop", "dance", "upbeat indie"],
  Angry: ["hard rock", "metal", "punk"],
  Surprise: ["jazz", "experimental", "funk"],
  Sad: ["ballads", "blues", "acoustic"],
  Fear: ["ambient", "dark electronic", "industrial"],
};

export async function POST(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ message: "User not found" }, { status: 401 });
  }

  try {
    const { emotions } = await request.json();
    console.log("Received emotions:", emotions);

    if (!emotions || typeof emotions !== "object") {
      throw new Error("Invalid emotions data");
    }

    const provider = "oauth_spotify";
    const clerkResponse = await clerkClient().users.getUserOauthAccessToken(
      userId,
      provider
    );
    const accessToken = clerkResponse.data[0]?.token;

    if (!accessToken) {
      return NextResponse.json(
        { message: "Access token is undefined" },
        { status: 500 }
      );
    }

    // Create a new playlist
    const createPlaylistResponse = await fetch(
      "https://api.spotify.com/v1/me/playlists",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Emotion-based Playlist",
          description: "A playlist created based on your emotions",
          public: false,
        }),
      }
    );

    if (!createPlaylistResponse.ok) {
      const errorData = await createPlaylistResponse.json();
      return NextResponse.json(
        { message: "Failed to create Spotify playlist", error: errorData },
        { status: createPlaylistResponse.status }
      );
    }

    const playlistData = await createPlaylistResponse.json();
    const playlistId = playlistData.id;
    const trackUris: string[] = [];
    const totalTracks = 20;

    // Calculate total weight for proportionate distribution
    const totalEmotionWeight = Object.values(emotions).reduce(
      (sum: number, prob: any) => {
        const probNum = Number(prob);
        if (!isNaN(probNum)) {
          return sum + probNum;
        }
        return sum;
      },
      0
    );

    console.log("Total emotion weight:", totalEmotionWeight);

    if (totalEmotionWeight <= 0) {
      throw new Error("Total emotion weight is zero or negative");
    }

    // Search for top tracks for each emotion and add to playlist
    for (const [emotion, probability] of Object.entries(emotions)) {
      const probNum = Number(probability);
      if (isNaN(probNum) || probNum <= 0) {
        console.log(`Skipping emotion ${emotion} with probability ${probNum}`);
        continue; // Skip emotions with zero or invalid probability
      }

      const genres = emotionToGenre[emotion] || [];
      if (!Array.isArray(genres)) {
        console.error(`Genres for emotion ${emotion} is not an array:`, genres);
        continue; // Skip if genres is not an array
      }

      const numTracks = Math.ceil((probNum / totalEmotionWeight) * totalTracks);

      console.log(`Searching for ${numTracks} tracks for emotion ${emotion}`);
      console.log(`Genres for emotion ${emotion}:`, genres);

      for (const genre of genres) {
        const searchResponse = await fetch(
          `https://api.spotify.com/v1/search?q=genre:${genre}&type=track&limit=${numTracks}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          console.log(`Search results for genre ${genre}:`, searchData);

          const tracks = searchData.tracks.items;
          if (tracks.length > 0) {
            trackUris.push(...tracks.map((track: any) => track.uri));
          } else {
            console.log(`No tracks found for genre ${genre}`);
          }
        } else {
          const errorData = await searchResponse.json();
          console.error(
            `Error searching for tracks for genre ${genre}:`,
            errorData
          );
        }
      }
    }

    // Ensure the total number of tracks is not more than 20
    if (trackUris.length > totalTracks) {
      trackUris.length = totalTracks;
    }

    console.log("Final list of track URIs:", trackUris);

    // Add tracks to the playlist
    if (trackUris.length > 0) {
      const addTracksResponse = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uris: trackUris }),
        }
      );

      if (!addTracksResponse.ok) {
        const errorData = await addTracksResponse.json();
        throw new Error(
          `Failed to add tracks to playlist: ${errorData.error.message}`
        );
      }
    } else {
      console.warn("No tracks were found to add to the playlist.");
    }

    return NextResponse.json({
      message: "Playlist created",
      playlistUrl: playlistData.external_urls.spotify,
    });
  } catch (error) {
    console.error("Error creating Spotify playlist:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
