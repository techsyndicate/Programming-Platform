// Import Packages
import React, { useState } from "react";
import Axios from "axios";
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router'

// Import Files
import "./App.css";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import NavigationBar from "./Components/Navigation/NavigationBar";

function App() {
  const [data, setData] = useState(null);
  const getUser = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:3200/auth/user",
    }).then((res) => {
      setData(res.data);
      console.log(res.data);
    });
  };
  const logout = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:3200/auth/logout",
    }).then((res) => console.log(res));
  }

  function IndexApp() {
    return (
      <div className="App">

        <div>
          <h1>Get User</h1>
          <button onClick={getUser}>Submit</button>
          {data ? <h1>Welcome Back {data.username}</h1> : null}
        </div>

        <div>
          <h1>Logout User</h1>
          <button onClick={logout}>Logout</button>
        </div>

      </div>
    )
  }

  function Fourzerofour() {
    return (
      <div>
        <h1>404</h1>
      </div>
    )
  }

  return (
    <div>
      <Router>
        <NavigationBar />
        <Routes>
          <Route path={process.env.PUBLIC_URL + '/'} element={<IndexApp />} />
          <Route path={process.env.PUBLIC_URL + '/login'} element={<Login />} />
          <Route path={process.env.PUBLIC_URL + '/register'} element={<Register />} />
          <Route path="*" element={<Fourzerofour />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;