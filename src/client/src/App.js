import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";

axios.defaults.baseURL = "http://localhost:5000";

function App() {
  const [data, setData] = useState(null);

  // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.ts
  const callBackendAPI = async () => {
    return axios.get("/wins/2018/MIN").then(res => {
      return res.data;
    });
  };

  useEffect(() => {
    // Call our fetch function below once the component mounts
    callBackendAPI()
      .then(res => {
        console.log(res);
        setData(res.express);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {data}
        </a>
      </header>
    </div>
  );
}

export default App;
