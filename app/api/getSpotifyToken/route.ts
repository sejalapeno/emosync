// utils/getSpotifyToken.ts
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";

export const getSpotifyToken = async (req: NextApiRequest) => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const user = await clerkClient.users.getUser(userId);

  // Ensure the token is stored in a safe place in the user's metadata
  const accessToken = user.publicMetadata.spotifyAccessToken;

  if (!accessToken) {
    throw new Error("Spotify access token not found");
  }

  return accessToken;
};
