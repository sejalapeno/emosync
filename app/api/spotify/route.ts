// app/api/spotify/route.ts
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ message: "User not found" }, { status: 401 });
  }

  try {
    const provider = "oauth_spotify"; // Make sure this matches your Clerk configuration

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

    const spotifyUrl = "https://api.spotify.com/v1/me";

    const spotifyResponse = await fetch(spotifyUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!spotifyResponse.ok) {
      const errorData = await spotifyResponse.json();
      return NextResponse.json(
        { message: "Failed to fetch Spotify data", error: errorData },
        { status: spotifyResponse.status }
      );
    }

    const spotifyData = await spotifyResponse.json();

    // Return the Spotify data including the profile image
    return NextResponse.json({ message: spotifyData });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
