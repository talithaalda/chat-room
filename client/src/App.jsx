import { useEffect, useState } from "react";
import "./App.css";
import useMessages from "./utils/useMessages";

function App() {
  const {
    messages,
    // user,
    handleSubmit,
    handleDelete,
    handleUsernameSubmit,
    showModal,
    setShowModal,
    resetScroll,
    getMessages,
  } = useMessages();
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    let userId = localStorage.getItem("userId");
    setCurrentUserId(userId);
    getMessages();
  }, [messages]);
  useEffect(() => {
    resetScroll();
  }, []);
  useEffect(() => {
    let userName = localStorage.getItem("userName");

    if (userName) {
      setShowModal(false);
    } else {
      setShowModal(true);
    }
  }, []);
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
      </div>
      <div className="messages flex flex-col gap-2" id="messages">
        {messages.map((message) =>
          message.user && message.user.id ? (
            (console.log(message.user.id),
            (
              <div
                className={`message ${
                  message.user.id == currentUserId
                    ? "message-right"
                    : "message-left"
                }`}
                key={message.id}
              >
                <div className="flex gap-2 items-center">
                  <h2>
                    <b>{message.user.name}</b>
                  </h2>
                  <p>{message.body}</p>
                  <button onClick={() => handleDelete(message.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div key={message.id} className="message-placeholder">
              <p>User information is missing</p>
            </div>
          )
        )}
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
