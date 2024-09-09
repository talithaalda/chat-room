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
  const [userUpdated, setUserUpdated] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
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
    if (data.message.type === "delete_confirmation") {
      getMessages();
    } else {
      const message = data.message;
      console.log(message);
      setMessagesAndScrollDown([...messages, message]);
    }
  };

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
      setDeleteOpen(false);
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
      setUser((prevUser) => [...prevUser, newUser]);
      localStorage.setItem("userId", newUser.id);
      localStorage.setItem("userName", name);
      setUserUpdated(true);
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
    userUpdated,
    handleUsernameSubmit,
    showModal,
    getMessages,
    resetScroll,
    setShowModal,
    setDeleteOpen,
    deleteOpen,
  };
};

export default useMessages;
