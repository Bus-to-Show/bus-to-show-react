import React, { useRef , useEffect} from 'react'
import ReservationsView from '../ReservationsView/ReservationsView'
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import RegisterUserToast from './RegisterUserToast';
import ForgotForm from './ForgotForm';
import { useStore } from '../../Store';
import { useNavigate } from 'react-router-dom';

const LoginView = (props) => {
  const {
    btsUser,
    showForgotForm,
    toggleShowForgotForm,
    userReservations,
    reservationDetail,
    displayReservationDetail,
    displayEditReservation,
  } = useStore();

  const myRef = useRef(null);
  const navigate = useNavigate()

  useEffect(() => {
    window.$(myRef.current).tooltip();
  }, [reservationDetail, displayReservationDetail]);

  const {
    toggleRegister,
    showRegisterForm,
    requestRegistration,
    registerResponse,
    profileClick,
    responseLogin,
    displayReservations,
    toggleReservationView,
  } = props

let futureClass = 'border'
  let pastClass = 'border'

  if (props.displayFuture){
    futureClass = 'border border-success'
    pastClass = 'border bg-light'
  } else if (props.displayPast){
    pastClass = 'border border-success'
    futureClass = 'border bg-light'
  }

  if(showForgotForm){
    return <ForgotForm />
  } else {
    return (
      <div className='container-fluid'>
      {!displayReservationDetail && props.displayUserReservationSummary
      ?
      <div className="alert alert-warning cart-item-font" role="alert">Note: This view only displays the reservations  made while logged in.  Reservations made while not logged in are not shown. Confirmation emails are sent to the email address entered at checkout regardless of whether or not you are logged in.
      </div>
      : ''
      }
          <div className='row p-2 mb-4'>
            {!btsUser.isLoggedIn && !showRegisterForm?
            <>
            <div className='row'>
              <div className='col-12 text-center'>
                <LoginForm
                  responseLogin={responseLogin}
                />
              <div className='row'>
              <div className='col-12 text-center'>
                <h4 className="bts-white-bg mb-2">
                  - OR -
                </h4>
              </div>
              </div>
                <div className="row p-2">
                <div className='col-12 text-center'>
                  <button type="button" className="btn detail-btn mr-2" ref={myRef} data-toggle="tooltip" data-placement="bottom"
                    title="It's ok to reserve and ride without being signed into an account. Accounts just make it so you can manage your current reservations, view your past shows, etc."
                    onClick={()=>{navigate('/')}}>
                    <strong>Continue as Guest</strong>
                  </button>
                  <button type="button" className="btn detail-btn ml-2"
                    onClick={()=> {toggleRegister()}}>
                    <strong>Register</strong>
                  </button>
                  <button type="button" className="btn bts-white-bg"
                    onClick={()=> {toggleShowForgotForm(true)}}>
                    <strong>Forgot / Reset </strong>
                  </button>
                </div>
              </div>
              </div>
            </div>
            </>
            :
            showRegisterForm
              ?
              <div>
                <RegistrationForm
                  toggleRegister={toggleRegister}
                  requestRegistration={requestRegistration}
                  />
                {registerResponse.code && <RegisterUserToast response={registerResponse} />}
              </div>
              :
            <button
                onClick={props.logout}
                type="button"
                className="btn btn-outline-dark login-btn">
                Log Out
            </button>
            }
          </div>
          <div className='row'>
            {btsUser.isLoggedIn ?
            <div className='col-12 text-center'>
              {displayReservations ?
              <div>
                {displayReservationDetail && displayEditReservation
                ?
                  <div onClick={toggleReservationView} className="btn btn-block-admin detail-btn my-2 col-12" id="detail" >
                  Back to Reservation Detail View
                  </div>
                :
                  <div>
                  {displayReservationDetail && reservationDetail
                  ?
                    <div onClick={toggleReservationView} className="btn btn-block-admin detail-btn my-2 col-12" id="summary" >
                    Back to Reservations Summary
                    </div>
                  :
                    <div onClick={toggleReservationView} className="btn btn-block-admin detail-btn my-2 col-12" id="dashboard" >
                    Back to User Dashboard
                    </div>
                  }
                  </div>
                }
                {!displayReservationDetail && props.displayUserReservationSummary ?
                <div className="row">
                  <div className="col-12">
                  <div className="row" id="futurePast" onClick={props.toggleFuturePast}>
                      <div className="col-2">
                      </div>
                      <div className="col-4">
                        <div className={futureClass} id="future">
                            Future
                        </div>
                      </div>
                      <div className="col-4">
                        <div className={pastClass} id="past">
                            Past
                        </div>
                      </div>
                      <div className="col-2">
                      </div>
                    </div>
                  </div>
                </div>
                :''
                }
                  <ReservationsView
                    displayFuture={props.displayFuture}
                    userReservations={userReservations}
                    reservationEditField={props.reservationEditField}
                    submitReservationForm={props.submitReservationForm}
                    toggleEditSuccess={props.toggleEditSuccess}
                  />
                </div>
                : '' }
                {displayReservations ? ''
                :
                <div>
                <div className="btn btn-block-admin detail-btn my-2 col-12" onClick={toggleReservationView}>
                  <strong>My Reservations</strong>
                </div>
                <div className="btn btn-block-admin detail-btn my-2 col-12" onClick={profileClick}>
                  <strong>Back to Events</strong>
                </div>
              </div>
            }
            </div>
            : ''
            }
            </div>
      </div>
    )
  }
}

export default LoginView
