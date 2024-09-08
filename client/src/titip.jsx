import { useState, useEffect } from "react";
import "./App.css";

const ws = new WebSocket("ws://localhost:3000/cable");

function App() {
  const [messages, setMessages] = useState([]);
  const [guid, setGuid] = useState("");
  const [showModal, setShowModal] = useState(true);
  const messagesContainer = document.getElementById("messages");

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

  useEffect(() => {
    fetchMessages();
  }, [messages]);

  useEffect(() => {
    resetScroll();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = e.target.message.value;
    e.target.message.value = "";

    await fetch("http://localhost:3000/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body }),
    });
  };

  const handleDelete = async (id) => {
    // if (!window.confirm("Are you sure you want to delete this message?"))
    //   return;
    await fetch(`http://localhost:3000/messages/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const fetchMessages = async () => {
    const response = await fetch("http://localhost:3000/messages");
    const data = await response.json();
    setMessagesAndScrollDown(data);
  };

  const setMessagesAndScrollDown = (data) => {
    setMessages(data);
    resetScroll();
  };

  const resetScroll = () => {
    if (!messagesContainer) return;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };
  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.username.value;
    e.target.username.value = "";

    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to create user:", errorData);
    }
    setShowModal(false);
  };
  return (
    <div className="App">
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Enter Your Name</h2>
            <form onSubmit={handleUsernameSubmit}>
              <input type="text" name="username" required />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
      <div className="messageHeader">
        <h1>Let&apos;s Chat</h1>
        {/* <p>Guid: {guid}</p> */}
      </div>
      <div className="messages flex flex-col gap-2" id="messages">
        {messages.map((message) => (
          <div className="message " key={message.id}>
            <div className="flex gap-2 items-center">
              <p>{message.body}</p>
              <button onClick={() => handleDelete(message.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className="messageForm">
        <form onSubmit={handleSubmit}>
          <input className="messageInput" type="text" name="message" />
          <button className="messageButton" type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
