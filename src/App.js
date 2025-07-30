import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import useSize from '@react-hook/size';
import ReactGA from 'react-ga';

// Styling
import './App.css';

// Pages
import LayoutPage from './Pages/LayoutPage';

// Components
import Header from './Components/Header';
import Login from './Components/Account/Login';
import Orders from './Components/Account/Orders';
import Register from './Components/Account/Register';
import Reset from './Components/Account/Reset';
import Verify from './Components/Account/Verify';
import { useStore } from './Store';

if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize('UA-17782248-2');
  ReactGA.pageview('/app');
}

const fetchUrl = `${process.env.REACT_APP_API_URL}`;

const App = () => {
  const {setBtsUser} = useStore();

  useEffect(() => {
    const checkAuth = async () => {
      const jwtToken = localStorage.getItem('jwt')

      if (!jwtToken) {
        return
      }

      const response = await fetch(`${fetchUrl}/api/secure`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        withCredentials: true
      })

      const userObj =  await response.json()

      if (userObj && userObj.id) {
        setBtsUser({
          isLoggedIn: true,
          id: userObj.id,
          firstName: userObj.firstName,
          lastName: userObj.lastName,
          email: userObj.email,
        })
      } else {
        localStorage.setItem('jwt', '')
      }
    }

    checkAuth()
  }, []);

  const appRef = useRef(null);
  const [width, height] = useSize(appRef);

  useEffect(() => {
    if (window === window.parent) {
      // This would meean we aren't in an iframe
      return;
    }

    // Tell the host window how to size the iframe
    window.parent.postMessage({
      type: 'resize-iframe',
      width,
      height,
    }, process.env.REACT_APP_HOME_URL);
  }, [width, height]);

  return (
    <Router basename="/bus-to-show-react">
      <div id="app" ref={appRef}>
        <Header />
        <Routes>
          <Route path="/" element={<LayoutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset/:token?" element={<Reset />} />
          <Route path="/verify/:token" element={<Verify />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
