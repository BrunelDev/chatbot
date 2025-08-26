export const sendMessageToRag = async ({message, profile}: {message: string, profile: string}) => {
  try {
    const response = await fetch("http://192.168.1.10:8000/api/v1/rag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        profile,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
