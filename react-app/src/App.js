// Import Packages
import React, { useState } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router'

// Import Files
import 'notyf/notyf.min.css'; // for React, Vue and Svelte
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import "./App.css";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import NavigationBar from "./Components/Navigation/NavigationBar";
import Fourzerofour from './Components/404/404';
import Profile from "./Pages/Profile/Profile";
import { getUser } from './Components/reuse/Misc';

function App() {
  const [data, setData] = useState(null);
  const getUserButton = async () => {
    var hmm = await getUser();
    setData(hmm);
    console.log(hmm)
  };

  function IndexApp() {
    return (
      <div className="App">

        <div>
          <h1>Get User</h1>
          <button onClick={getUserButton}>Submit</button>
          {data ? <h1>Welcome Back {data.username}</h1> : null}
        </div>
        
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
          <Route path={process.env.PUBLIC_URL + '/profile'} element={<Profile />} />
          <Route path="*" element={<Fourzerofour />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;