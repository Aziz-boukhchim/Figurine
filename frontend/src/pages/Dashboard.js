import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import React, { useEffect } from "react";


export default function Dashboard() {

useEffect(() => {
  document.body.classList.add("admin-page");
  return () => {
    document.body.classList.remove("admin-page");
  };
}, []);


  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet /> {/* This will render the child page */}
      </div>
    </div>
  );
}
