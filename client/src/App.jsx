import { useEffect, useRef, useState } from "react";
import "./App.css";
import useMessages from "./utils/useMessages";
import { BsFillSendFill } from "react-icons/bs";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
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
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

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
      console.log("show modal");
    }
  }, [userUpdated]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode); // Simpan ke localStorage
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.setAttribute("data-theme", "dark");
    } else {
      document.body.setAttribute("data-theme", "light");
    }
  }, [isDarkMode]);
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
    <div className="App ">
      {showModal && (
        <div
          className="modal-overlay"
          data-theme={isDarkMode ? "dark" : "light"}
        >
          <div className="modal-content">
            <h2 className="modal-title">Enter Your Name</h2>
            <form onSubmit={handleUsernameSubmit} className="space-y-4">
              <input
                type="text"
                name="username"
                required
                placeholder="Your name"
                className="modal-input"
              />
              <button
                type="submit"
                className="w-full bg-[#8b5afa] dark:bg-[#6d28d9] text-white p-2 rounded-md hover:bg-indigo-600 dark:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      <div
        className="messageContainer relative"
        data-theme={isDarkMode ? "dark" : "light"}
      >
        <div className="messageHeader bg-base-100 bg-opacity-70 ">
          <h1 className="messageTitle text-2xl font-semibold">
            Let&apos;s Chat
          </h1>
          <p className="messageDescription">Talk freely, share openly.</p>
        </div>
        <button
          onClick={toggleDarkMode}
          className="flex justify-end w-full p-2 absolute top-5 right-10 z-10"
        >
          {isDarkMode ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
        </button>
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
                    className={` ${
                      message.user.id == currentUserId
                        ? "date-right"
                        : "date-left"
                    }`}
                  >
                    <span className="text-gray-500 text-xs ml-2">
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                    <div
                      className={`cursor-pointer ${
                        message.user.id == currentUserId
                          ? "message-right"
                          : "message-left"
                      }`}
                      key={message.id}
                      onClick={(e) => handleContextMenu(e, message.id)}
                    >
                      <div className="flex gap-2 items-center">
                        <p>{message.body}</p>
                      </div>
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
