const API_URL = import.meta.env.VITE_API_URL;

console.log("API URL:", API_URL);
export const fetchMessages = async () => {
  const response = await fetch(`${API_URL}/messages`);
  const data = await response.json();
  return data;
};
export const submitMessage = async (body, userId) => {
  const response = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ body, user_id: userId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error("Failed to create message: ", errorData);
  }

  return await response.json();
};

export const deleteMessage = async (messageId) => {
  // if (!window.confirm("Are you sure you want to delete this message?"))
  //   return;
  const response = await fetch(`${API_URL}/messages/${messageId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete message");
  }

  // return await response.json();
};
