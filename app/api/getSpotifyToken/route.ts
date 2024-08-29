// app/api/getSpotifyToken/route.ts
import { NextResponse } from "next/server";
import { getSpotifyToken } from "../../utils/getSpotifyToken"; // Adjust the path as necessary

export async function GET() {
  try {
    const accessToken = await getSpotifyToken();
    return NextResponse.json({ token: accessToken });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
