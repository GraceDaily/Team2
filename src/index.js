import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { AppProvider } from "./Components/context";
import { LibraryProvider } from './Components/LibraryContext';

ReactDOM.render(
  <LibraryProvider>
    <AppProvider>
      <App />
    </AppProvider>
  </LibraryProvider>,
  document.getElementById("root")
);
