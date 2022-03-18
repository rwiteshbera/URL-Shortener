import "./App.css";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import io from "socket.io-client";

const serverURL = "http://localhost:8080/"
const clientURL = "http://localhost:3001/"

var socket = io(serverURL);

function App() {
  const [inputURL, setInputURL] = useState("");
  const [showShortedURL, setShowShortedURL] = useState("")
  
  const onChangeInput = (e) => {
    setInputURL(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    socket.emit("sendInputURL", inputURL)
    socket.on("sendURLtoClient", (uID) => {
      setShowShortedURL(`${clientURL}${uID}`);
    });

  }

  return (
    <div className="container-custom">
      <h1>Hello, I am URL Shortener</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="url"
          name="fullURL"
          id="fullURL"
          autoComplete="off"
          value={inputURL}
          onChange={onChangeInput}
        />
        <Button variant="success" type="submit">
          Shorten
        </Button>
      </form>
      <div id="showShortedURL">{showShortedURL}</div>
    </div>
  );
}

export default App;
