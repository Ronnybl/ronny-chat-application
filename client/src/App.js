import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import Chat from "./components/Chat";

const socket = io.connect("http://localhost:3001");

function App() {
  //User states
  const [userName, setUser] = useState("");
  //Room states
  const [room, setRoom] = useState("");
  //Message States
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageRecieved] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (userName !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  const sendMessage = () => {
    socket.emit("send_message", { message, room });
  };

  useEffect(() => {
    socket.off("receive_message").on("receive_message", (data) => {
      setMessageRecieved(data.message);
    });
  }, [socket]);
  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h1>Join a Room</h1>
          <input
            placeholder="Enter Your Name"
            onChange={(event) => {
              setUser(event.target.value);
            }}
          />
          <input
            placeholder="Enter Room Number..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <Chat socket={socket} userName={userName} room={room} />
      )}
    </div>
  );
}

export default App;
