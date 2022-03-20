import "./App.css";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { InputGroup, FormControl } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import io from "socket.io-client";
import { CopyToClipboard } from "react-copy-to-clipboard";

const REDIRECTION_SERVER = "http://localhost:8080/";

var socket = io(REDIRECTION_SERVER);

function App() {
  const [inputURL, setInputURL] = useState("");
  const [showShortedURL, setShowShortedURL] = useState("");
  const [copyButtonText, setCopyButtonText] = useState("Copy");
 
  const onChangeInput = (e) => {
    setInputURL(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCopyButtonText("Copy")
    socket.emit("sendInputURL", inputURL);
    socket.on("sendURLtoClient", (uID) => {
      setShowShortedURL(`${uID}`);
    });
  };

  const Copy = () => {
    setCopyButtonText("Copied");
  };

  const disableUIDchange = () => {

  }

  const visitURL = () => {
    window.open(inputURL)
  }

  return (
    <div className="container">
      <div className="left-section">
        <div className="title">MiniURL</div>
        <h4 className="subtitle">Shorten your long URL into a mini URL</h4>
        <div className="features">
          <h5>1. Easy Link Shortening</h5>
          <h5>2. Redirect any link</h5>
          <h5>3. User friendly and accessible</h5>
        </div>
      </div>
      <div className="container-custom">
      <h1 id="heading">Enter a long url to make a mini URL</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Shorten your URL"
          type="url"
          name="fullURL"
          id="fullURL"
          autoComplete="off"
          value={inputURL}
          onChange={onChangeInput}
        />
        <Button variant="success" type="submit" id="shorten-btn">
          Shorten
        </Button>
      </form>
        
      <InputGroup className="mb-3" id="alias-form">
        <Button variant="secondary" id="button-addon1">
          {REDIRECTION_SERVER}
        </Button>
        <FormControl 
          onChange={disableUIDchange}
          value={showShortedURL}
        />
      </InputGroup>

      <CopyToClipboard text={`${REDIRECTION_SERVER}${showShortedURL}`}>
        <Button variant="primary" onClick={Copy} id="btn">
          {copyButtonText}
        </Button>
      </CopyToClipboard>
      <Button variant="primary" onClick={visitURL} id="btn">
          Visit URL
        </Button>
    </div>
    </div>
  );
}

export default App;
