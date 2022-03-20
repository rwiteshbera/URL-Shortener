import "./App.css";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { InputGroup, FormControl } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import io from "socket.io-client";
import { CopyToClipboard } from "react-copy-to-clipboard";

const serverURL = "http://localhost:8080/";
const redirectionURL = "http://localhost:6000/";

var socket = io(serverURL);

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
    <div className="container-custom">
      <h1 id="heading">Hello, I am URL Shortener</h1>
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
          {redirectionURL}
        </Button>
        <FormControl 
          onChange={disableUIDchange}
          value={showShortedURL}
        />
      </InputGroup>

      <CopyToClipboard text={`${redirectionURL}${showShortedURL}`}>
        <Button variant="primary" onClick={Copy}>
          {copyButtonText}
        </Button>
      </CopyToClipboard>
      <Button variant="primary" onClick={visitURL}>
          Visit URL
        </Button>
    </div>
  );
}

export default App;
