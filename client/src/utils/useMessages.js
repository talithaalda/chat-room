import { useState } from "react";
import { fetchMessages, submitMessage, deleteMessage } from "../api/messageApi"; // Ensure correct import
import { submitUser } from "../api/userApi";
const ws = new WebSocket("ws://localhost:3000/cable");
const useMessages = () => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState([]);
  // const [userId, setUserId] = useState(null);
  const [guid, setGuid] = useState("");
  const [showModal, setShowModal] = useState(true);
  const messagesContainer = document.getElementById("messages");
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  ws.onopen = () => {
    console.log("Connected to websocket server");
    setGuid(Math.random().toString(36).substring(2, 15));

    ws.send(
      JSON.stringify({
        command: "subscribe",
        identifier: JSON.stringify({
          id: guid,
          channel: "MessagesChannel",
        }),
      })
    );
  };

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.type === "ping") return;
    if (data.type === "welcome") return;
    if (data.type === "confirm_subscription") return;

    const message = data.message;
    setMessagesAndScrollDown([...messages, message]);
  };

  // return () => ws.close(); // Clean up the WebSocket connection on component unmount

  const getMessages = async () => {
    try {
      const response = await fetchMessages();
      setMessages(response);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = e.target.message.value;
    e.target.message.value = "";
    try {
      const newMessage = await submitMessage(
        body,
        localStorage.getItem("userId")
      );
      // console.log("Message created:", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      resetScroll();
    } catch (error) {
      console.error("Failed to create message:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMessage(id);
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== id)
      );
      getMessages();
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.username.value;
    e.target.username.value = "";

    try {
      const newUser = await submitUser(name);
      // setUserId(newUser.id);
      setUser((prevUser) => [...prevUser, newUser]);
      console.log("User created:", newUser.id);
      localStorage.setItem("userId", newUser.id);
      localStorage.setItem("userName", name);
    } catch (error) {
      console.error("Failed to create user:", error);
    }

    setShowModal(false);
  };

  const setMessagesAndScrollDown = (data) => {
    setMessages(data);
    resetScroll();
  };

  const resetScroll = () => {
    if (messagesContainer && !isUserScrolling) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  return {
    messages,
    user,
    handleSubmit,
    handleDelete,
    handleUsernameSubmit,
    showModal,
    getMessages,
    resetScroll,
    setShowModal,
  };
};

export default useMessages;
