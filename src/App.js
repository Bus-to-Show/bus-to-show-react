import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import useSize from '@react-hook/size';
import ReactGA from 'react-ga';
import { sha256 } from 'js-sha256';

// Pages
import LayoutPage from './Pages/LayoutPage';
import VerifyPage from './Pages/VerifyPage';
import ResetPage from './Pages/ResetPage';

// Components
import Header from './Components/Header';
import LoginView from './Components/LoginView/LoginView';
import { useStore } from './Store';

if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize('UA-17782248-2');
  ReactGA.pageview('/app');
}

const fetchUrl = `${process.env.REACT_APP_API_URL}`;

const App = () => {
  const {
     btsUser,
     setBtsUser,
     setUserReservations,
     displayEditSuccess,
     setDisplayEditSuccess,
     displayUserReservationSummary,
     setDisplayUserReservationSummary,
     reservationDetail,
     setReservationDetail,
     setDisplayReservationDetail,
     setDisplayEditReservation,
  } = useStore();

  const [displayFuture, setDisplayFuture] = useState(false);
  const [, setDisplayLoginView] = useState(false);
  const [displayPast, setDisplayPast] = useState(false);
  const [displayReservations, setDisplayReservations] = useState(false);

  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const [registerResponse, setRegisterResponse] = useState({});
  const [reservationEditsToSend, setReservationEditsToSend] = useState([]);
  const [, setPickupLocations] = useState([]);
  const [willCallEdits, setWillCallEdits] = useState({})

  const getReservations = async () => {
    const userId = btsUser.userDetails.id
    if (userId) {
      const reservations = await fetch(`${fetchUrl}/orders/${userId}`)
      const userReservations = await reservations.json()
      setUserReservations(userReservations)
    }
  }

  const handleEditSend= async(newRETS)=>{
    newRETS.map(async(reservation)=>{
      console.log('reservation inside handleEditSend ==>>==>> ', reservation );
      const editReservationResponse = await fetch(`${fetchUrl}/reservations`, {
        method: 'PATCH',
        body: JSON.stringify({
          id: parseInt(reservation.id),
          willCallFirstName: reservation.willCallFirstName,
          willCallLastName: reservation.willCallLastName,
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .catch()
      const json = await editReservationResponse.json()
      const e = {target: {id: "edit"}}
      toggleReservationView(e)
      console.log('editReservationResponse ==>>==>> ', json );
      if(json.status === 200){
        setDisplayEditSuccess(true)
      } else {
        setDisplayEditSuccess(false)
      }
    })
  }

  const logout = () => {
    toggleLoggedIn(false);
    profileClick()
  }

  const profileClick = () => {
    setDisplayLoginView((prevState) => !prevState);
  };

  const requestRegistration = async (request) => {
    const password = sha256(request.password)
    const usersInfo = await fetch(`${fetchUrl}/users`, {
      method: 'POST',
      body: JSON.stringify({
        firstName: request.firstName,
        lastName: request.lastName,
        email: request.email,
        hshPwd: password
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const userObj = await usersInfo.json()
    setRegisterResponse(userObj)
  }

  const reservationEditField = (e) => {
    setWillCallEdits({
      ...willCallEdits,
      [e.target.name]: e.target.value,
      id: e.target.id
    })
  }

  const responseLogin = async (loginInfo) => {
    const {email, password} = loginInfo
    const hashedPassword = sha256(password);

    const usersInfo = await fetch(`${fetchUrl}/users/login`, {
      method: 'POST',
      body: JSON.stringify({
        username: email,
        password: hashedPassword
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const userObj = await usersInfo.json()
    // {email: "dustin@undefinedindustries.com", id:105, isAdmin:true, token:"eyJhbGciOiJIUzI}

    if (userObj && userObj.token) {
      localStorage.setItem('jwt', userObj.token);
      setBtsUser({
          isLoggedIn: true,
          userID: userObj.id,
          email:userObj.email,
          userDetails:userObj
      });
    }

  }

  const submitReservationForm = (e) => {
    console.log('submitReservationForm ==>>==>> ', e );
    e.preventDefault()
    let newRETS = [ ...reservationEditsToSend ]
    newRETS.push(willCallEdits)
    setReservationEditsToSend(newRETS)
    handleEditSend(newRETS)
  }

  const toggleEditSuccess=()=>{
    setDisplayEditSuccess(!displayEditSuccess);
  }

  const toggleFuturePast = (e) => {
    if(e.target.id==='future'){
      setDisplayPast(false);
      setDisplayFuture(true);
    } else if(e.target.id==='past'){
      setDisplayPast(true);
      setDisplayFuture(false);
    }
  }

  const toggleLoggedIn = (boolean) => {
    if (boolean === false){
      setBtsUser({
          isLoggedIn: false,
          userID: '',
          name: '',
          email:'',
          picture:'',
          userDetails: {
            isAdmin: false,
            isStaff: false,
            isDriver: false,
          },
        })
        localStorage.setItem('jwt', '')
      }
    }

  const toggleRegister = () => {
    setShowRegisterForm(!showRegisterForm);
  }

  const toggleReservationView = (e) => {
    getReservations();
    setDisplayFuture(true);
    setDisplayPast(false);
    setDisplayUserReservationSummary(true);
    if(!reservationDetail){
      setDisplayReservations(!displayReservations);
    }

    if(e.target.id==='dashboard' || e.target.id==='summary'){
      setDisplayReservationDetail(false);
      setReservationDetail(null);
      setDisplayUserReservationSummary(false);
    }
    if(e.target.id === 'detail' || e.target.id === 'edit'){
      setDisplayReservations(true);
      setDisplayEditReservation(false);
      setDisplayReservationDetail(true);
      setDisplayUserReservationSummary(false);
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      const jwtToken = localStorage.getItem('jwt')
      if(!jwtToken){
        return
      }
      const response = await fetch(`${fetchUrl}/api/secure`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          },
          withCredentials: true
        }
      )
      const userObj =  await response.json()
      if (userObj && userObj.id){
        setBtsUser({
          ...btsUser,
          isLoggedIn: true,
              userID: userObj.id,
              email:userObj.email,
              userDetails:userObj
        })
      } else {
        toggleLoggedIn(false)
      }

    }
    checkAuth()
    const getPickupLocations = async () => {
      const pickups =  await fetch(`${fetchUrl}/pickup_locations`)
      setPickupLocations(pickups.json())
    }
    getPickupLocations();
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
      <div ref={appRef}>
        <Header />
        <Routes>
          <Route exact path="/" element={<LayoutPage />} />
          <Route exact path="/login" element={
            <LoginView
              displayReservations={displayReservations}
              toggleLoggedIn={toggleLoggedIn}
              logout={logout}
              showRegisterForm={showRegisterForm}
              toggleRegister={toggleRegister}
              requestRegistration={requestRegistration}
              registerResponse={registerResponse}
              profileClick={profileClick}
              toggleReservationView={toggleReservationView}
              responseLogin={responseLogin}
              toggleFuturePast={toggleFuturePast}
              displayFuture={displayFuture}
              displayPast={displayPast}
              displayUserReservationSummary={displayUserReservationSummary}
              reservationEditField={reservationEditField}
              submitReservationForm={submitReservationForm}
              toggleEditSuccess={toggleEditSuccess}
            />
          } />
          <Route path="/verify/:token" element={<VerifyPage />} />
          <Route path="/reset/:token" element={<ResetPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
