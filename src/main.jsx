import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Description from "./Description.jsx";

const router = createBrowserRouter([
  { path: "/", element: <App></App> },
  { path: "/product/:drugId", element: <Description></Description> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
