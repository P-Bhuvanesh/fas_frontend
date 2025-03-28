import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Admin from "./components/Admin";
import About from "./components/About";
import AddUser from "./components/AddUser";
import ActiveUsers from "./components/ActiveUsers";
import { Route, Routes } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/about" element={<About />} />
        <Route path="/adduser" element = {<AddUser/>}/>
        <Route path="/activeuser" element = {<ActiveUsers/>}/>
      </Routes>
    </>
  );
}

export default App;
