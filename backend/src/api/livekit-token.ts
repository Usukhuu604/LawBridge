// src/lib/livekit.ts (Correct name for this client-side file)

/**
 * Fetches a LiveKit access token from the EXTERNAL Express server.
 * This function runs on the CLIENT.
 *
 * @param chatRoomId - The name of the room to join.
 * @param clerkToken - The user's JWT from Clerk to authenticate with the Express backend.
 * @returns {Promise<string>} - The LiveKit access token.
 */
export async function fetchLiveKitToken(
  chatRoomId: string,
  clerkToken: string // We no longer need participantIdentity
): Promise<string> {
  try {
    // ✅ FIX: Use the full URL of your Express backend server
    const response = await fetch(
      "https://lawbridge-server.onrender.com/api/livekit-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${clerkToken}`,
        },
        // ✅ IMPROVEMENT: Only send the room name. The server will get the user's identity from the token.
        body: JSON.stringify({
          room: chatRoomId, // Ensure the key matches what the Express server expects ('room')
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      // This will now correctly show errors from your Express server
      throw new Error(`Failed to fetch LiveKit token: ${response.status} ${errorBody}`);
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error("Error fetching LiveKit token:", error);
    throw error;
  }
}