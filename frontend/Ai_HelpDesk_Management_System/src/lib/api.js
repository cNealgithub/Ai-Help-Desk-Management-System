const API_CHAT_URL = "/api/aiChat";

/**
 * Streams an AI chat response from the Spring AI backend.
 *
 * @param {string} query
 * @param {string} conversationId
 * @param {(chunk: string) => void} onChunk
 * @param {() => void} onComplete
 * @param {(error: Error) => void} onError
 * @returns {Promise<void>}
 */
export async function streamChat(
  query,
  conversationId,
  onChunk,
  onComplete,
  onError,
) {
  const handleChunk = typeof onChunk === "function" ? onChunk : () => {};
  const handleComplete =
    typeof onComplete === "function" ? onComplete : () => {};
  const handleError = typeof onError === "function" ? onError : () => {};

  try {
    if (typeof query !== "string" || query.trim() === "") {
      throw new Error("A non-empty chat query is required.");
    }

    if (typeof conversationId !== "string" || conversationId.trim() === "") {
      throw new Error("A conversation ID is required.");
    }

    const response = await fetch("/helpDesk/aiChat", {
      // Notice the relative URL
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        conversationId: conversationId,
      },
      body: query,
    });

    if (!response.ok) {
      const responseText = await response.text().catch(() => "");
      const detail = responseText ? `: ${responseText}` : "";
      throw new Error(
        `Chat request failed with status ${response.status}${detail}`,
      );
    }

    if (!response.body) {
      throw new Error("Chat response did not include a readable stream.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          const remainingText = decoder.decode();
          if (remainingText) {
            handleChunk(remainingText);
          }
          break;
        }

        const decodedText = decoder.decode(value, { stream: true });
        if (decodedText) {
          handleChunk(decodedText);
        }
      }
    } finally {
      reader.releaseLock();
    }

    handleComplete();
  } catch (error) {
    const normalizedError =
      error instanceof Error ? error : new Error(String(error));
    handleError(normalizedError);
  }
}
