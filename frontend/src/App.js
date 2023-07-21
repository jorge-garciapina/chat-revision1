import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Users from "./Users";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users" element={<Users />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* <Route path="/register" element={} /> */}

          {/* Uncomment these lines when the components are ready 
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={<Dashboard />} /> 
          */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
