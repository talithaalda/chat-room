import { useEffect, useRef, useState } from "react";
import "./App.css";
import useMessages from "./utils/useMessages";
import { BsFillSendFill } from "react-icons/bs";
function App() {
  const {
    messages,
    handleSubmit,
    handleDelete,
    handleUsernameSubmit,
    showModal,
    setShowModal,
    resetScroll,
    getMessages,
    userUpdated,
    setDeleteOpen,
    deleteOpen,
  } = useMessages();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
  });
  const dropdownRef = useRef(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  useEffect(() => {
    if (initialLoad) {
      getMessages().then(() => setInitialLoad(false));
    } else {
      resetScroll();
    }
  }, [messages, initialLoad]);
  useEffect(() => {
    resetScroll();
  }, []);
  useEffect(() => {
    let userName = localStorage.getItem("userName");
    let userId = localStorage.getItem("userId");
    console.log(userName, userId);
    setCurrentUserId(userId);
    if (userName) {
      setShowModal(false);
    } else {
      setShowModal(true);
    }
  }, [userUpdated]);
  const handleContextMenu = (event, messageId) => {
    event.preventDefault();
    setSelectedMessageId(messageId);

    const { clientX: left, clientY: top } = event;
    setDropdownPosition({ top, left });
    setDeleteOpen(true);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDeleteOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="App max-w-full">
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
      <div className="messageContainer" data-theme="light">
        <div className="messageHeader ">
          <h1 className="messageTitle">Let&apos;s Chat</h1>
          <p className="messageDescription">Talk freely, share openly.</p>
        </div>
        <div className="messagesLayout flex flex-col gap-4 " id="messages">
          {messages.map((message) =>
            message.user && message.user.id ? (
              <>
                <div className="messages">
                  <div
                    className={` ${
                      message.user.id == currentUserId
                        ? "messageUser-right"
                        : "messageUser-left"
                    }`}
                  >
                    <b>{message.user.name}</b>
                  </div>
                  <div
                    className={`cursor-pointer ${
                      message.user.id == currentUserId
                        ? "message-right"
                        : "message-left"
                    }`}
                    key={message.id}
                    onContextMenu={(e) => handleContextMenu(e, message.id)}
                  >
                    <div className="flex gap-2 items-center">
                      <p>{message.body}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              ""
            )
          )}
        </div>
        <div className="">
          <form onSubmit={handleSubmit} className="messageForm">
            <input
              className="messageInput"
              type="text"
              name="message"
              placeholder="Type a message"
            />
            <button className="" type="submit">
              <BsFillSendFill className="button-send" size={35} />
            </button>
          </form>
        </div>
        {deleteOpen && (
          <div
            className="menu dropdown-content bg-base-100 rounded-box z-[1] w-30 p-2 shadow"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              position: "absolute",
            }}
            ref={dropdownRef}
          >
            <ul>
              <li>
                <a onClick={() => handleDelete(selectedMessageId)}>Delete</a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
