// Import Packages
import React from "react";
import { BrowserRouter as Router, useParams } from 'react-router-dom';
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
import Question from "./Pages/Question/Question";
import Index from "./Pages/Index/Index";
import Practise from "./Pages/Practise/Practise";
import PractiseQuestions from "./Pages/PractiseQuestions/PractiseQuestions";
import Event from "./Pages/Event/Event";
import Submission from "./Pages/Submission/Submission";
import Footer from "./Components/footer/Footer";
import EventQuestions from "./Pages/EventQuestions/EventQuestions";

function App() {
  function QuesRedirect() {
    const { questionid } = useParams();
    window.location.href = '/question/' + questionid + '/problem';
  }

  return (
    <div>
      <Router>
        <NavigationBar/>
        <div className="min-height">
          <Routes>
            <Route path={process.env.PUBLIC_URL + '/'} element={< Index />} />
            <Route path={process.env.PUBLIC_URL + '/login'} element={<Login />} />
            <Route path={process.env.PUBLIC_URL + '/register'} element={<Register />} />
            <Route path={process.env.PUBLIC_URL + '/profile'} element={<Profile />} />
            <Route path={process.env.PUBLIC_URL + '/practice'} element={<Practise />} />
            <Route path={process.env.PUBLIC_URL + '/events'} element={<Event />} />
            <Route path={process.env.PUBLIC_URL + '/events/:eventid'} element={<EventQuestions />} />
            <Route path={process.env.PUBLIC_URL + '/submissions/:submissionid'} element={<Submission />} />
            <Route path={process.env.PUBLIC_URL + '/practice/:practiceid'} element={<PractiseQuestions />} />
            <Route path={process.env.PUBLIC_URL + '/question/:questionid'} element={<QuesRedirect />} />
            <Route path={process.env.PUBLIC_URL + '/question/:questionid/:questPart'} element={<Question />} />
            <Route path="*" element={<Fourzerofour />} />
          </Routes>
        </div>
        <Footer/>
      </Router>
    </div>
  );
}

export default App;