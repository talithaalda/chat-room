export const fetchMessages = async () => {
  const response = await fetch("http://localhost:3000/messages");
  const data = await response.json();
  return data;
};
export const submitMessage = async (body, userId) => {
  const response = await fetch("http://localhost:3000/messages", {
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
  const response = await fetch(`http://localhost:3000/messages/${messageId}`, {
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
