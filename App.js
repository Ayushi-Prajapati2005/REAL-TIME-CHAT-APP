import React, { useState, useEffect, useRef } from "react";

const ws = new WebSocket("ws://localhost:8080");

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    ws.onmessage = (event) => {
      const msg = {
        sender: "Other",
        text: event.data,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChat((prev) => [...prev, msg]);
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const msg = {
        sender: "You",
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      ws.send(message);
      setChat((prev) => [...prev, msg]);
      setMessage("");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>💬 WhatsApp Chat Clone</div>
      <div style={styles.chatBox}>
        {chat.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.messageBubble,
              alignSelf: msg.sender === "You" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "You" ? "#dcf8c6" : "#fff",
            }}
          >
            <div style={styles.meta}>
              <span style={styles.sender}>{msg.sender}</span>
              <span style={styles.time}>{msg.time}</span>
            </div>
            <div>{msg.text}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div style={styles.inputArea}>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.sendBtn}>➤</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Segoe UI, sans-serif",
    maxWidth: "500px",
    height: "95vh",
    margin: "20px auto",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #ccc",
    borderRadius: "10px",
    overflow: "hidden",
    backgroundColor: "#e5ddd5",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  header: {
    backgroundColor: "#075e54",
    color: "white",
    padding: "15px",
    fontWeight: "bold",
    fontSize: "18px",
    textAlign: "center"
  },
  chatBox: {
    flex: 1,
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    backgroundColor: "#ece5dd"
  },
  messageBubble: {
    margin: "6px",
    padding: "10px",
    borderRadius: "8px",
    maxWidth: "70%",
    wordWrap: "break-word",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
  },
  meta: {
    fontSize: "11px",
    color: "#555",
    marginBottom: "4px",
    display: "flex",
    justifyContent: "space-between"
  },
  sender: {
    fontWeight: "bold"
  },
  time: {
    fontStyle: "italic"
  },
  inputArea: {
    display: "flex",
    padding: "10px",
    backgroundColor: "#f0f0f0",
    borderTop: "1px solid #ccc"
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "15px"
  },
  sendBtn: {
    marginLeft: "10px",
    padding: "10px 16px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "#075e54",
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer"
  }
};

export default App;
