import React, { useState } from "react";
import "./App.css";
import Axios from "axios";

function App() {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [data, setData] = useState(null);
  const register = () => {
    Axios({
      method: "POST",
      data: {
        username: "fosho",
        password: registerPassword,
        email: registerUsername
      },
      withCredentials: true,
      url: "http://localhost:3200/auth/register",
    }).then((res) => console.log(res));
  };
  const login = () => {
    Axios({
      method: "POST",
      data: {
        password: loginPassword,
        email: loginUsername
      },
      withCredentials: true,
      url: "http://localhost:3200/auth/login",
    }).then((res) => console.log(res));
  };
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
  return (
    <div className="App">
      <div>
        <h1>Register</h1>
        <input
          placeholder="username"
          onChange={(e) => setRegisterUsername(e.target.value)}
        />
        <input
          placeholder="password"
          onChange={(e) => setRegisterPassword(e.target.value)}
        />
        <button onClick={register}>Submit</button>
      </div>

      <div>
        <h1>Login</h1>
        <input
          placeholder="username"
          onChange={(e) => setLoginUsername(e.target.value)}
        />
        <input
          placeholder="password"
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        <button onClick={login}>Submit</button>
      </div>

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
  );
}

export default App;