// src/lib/livekit.ts (Client-side code)

export async function fetchLiveKitToken(
  chatRoomId: string,
  clerkToken: string
): Promise<string> {
  console.log("[fetchLiveKitToken] Called with:", { chatRoomId, clerkToken });
  try {
    const url = "https://lawbridge-server.onrender.com/api/livekit-token";
    console.log("[fetchLiveKitToken] Fetching:", url);
    console.log("[fetchLiveKitToken] Request headers:", {
      "Content-Type": "application/json",
      Authorization: `Bearer ${clerkToken}`,
    });
    console.log("[fetchLiveKitToken] Request body:", { room: chatRoomId });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${clerkToken}`,
      },
      body: JSON.stringify({
        room: chatRoomId,
      }),
    });

    console.log("[fetchLiveKitToken] Response status:", response.status);
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (jsonErr) {
        errorData = {
          error: "Failed to parse error JSON",
          raw: await response.text(),
        };
        console.log(jsonErr);
      }
      console.error("[fetchLiveKitToken] Error response:", errorData);
      throw new Error(errorData.error || "An unknown error occurred.");
    }

    let data;
    try {
      data = await response.json();
    } catch (jsonErr) {
      console.error(
        "[fetchLiveKitToken] Failed to parse success JSON:",
        jsonErr
      );
      throw new Error("Failed to parse server response");
    }
    console.log("[fetchLiveKitToken] Success response:", data);
    return data.token;
  } catch (error) {
    console.error("[fetchLiveKitToken] Exception:", error);
    throw error;
  }
}
