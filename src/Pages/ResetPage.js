import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sha256 } from 'js-sha256';

const ResetPage = () => {
  const fetchUrl = `${process.env.REACT_APP_API_URL}`;
  const navigate = useNavigate();
  const { token } = useParams();
  const [resetResponse, setResetResponse] = useState(null);
  const [resendResponse, setResendResponse] = useState(null);

  const [values, setValues] = useState({
    password: '',
    confirmPassword: '',
    passwordError: '',
    confirmPasswordError: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const passwordValidator = (field) => {
    const stringToTest = field;
    const longEnough = stringToTest && stringToTest.length >= 8;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
    const hasSpecialChar = specialChar.test(stringToTest);
    const hasCapitalLetter = /[A-Z]/.test(stringToTest);
    const hasLowerCaseLetter = /[a-z]/.test(stringToTest);
    const hasNumericalCharacter = /\d/.test(stringToTest);

    const isValid = longEnough && hasSpecialChar && hasCapitalLetter && hasLowerCaseLetter && hasNumericalCharacter;

    return isValid ? true : false;
  }

  const validate = () => {
    let passwordError = "";
    let confirmPasswordError = "";

    if (!values.password) {
      passwordError = "Password cannot be empty";
    } else if (values.password.length < 8) {
      passwordError = "Password must be at least 8 characters";
    } else if (!passwordValidator(values.password)) {
      passwordError = "Password must contain at least 1 of each of the following: Uppercase, Lowercase, Number, Special Character";
    }

    if (!values.confirmPassword) {
      confirmPasswordError = "Confirm password cannot be empty";
    } else if (values.password !== values.confirmPassword) {
      confirmPasswordError = "Passwords do not match";
    }

    if (passwordError || confirmPasswordError) {
      setValues({ ...values, passwordError, confirmPasswordError });
      return false;
    }

    return true;
  };

  const resetPassword = async (password) => {
    setLoading(true);
    setResendResponse(null);

    const body = {
      hshPwd: sha256(password),
      reset: true,
      resetToken: token
    };

    const userInfo = await fetch(`${fetchUrl}/users/reset-pass`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const userObj = await userInfo.json();
    setLoading(false);
    setResetResponse(userObj)
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const isValid = validate();

    if (isValid) {
      resetPassword(values.password);
      // clear form
      setValues({
        password: '',
        confirmPassword: '',
        passwordError: '',
        confirmPasswordError: '',
      });
    }
  };

  const resendEmail = async (email) => {
    setLoading(true);
    setResetResponse(null);

    const body = {
      username: email,
      reset: true,
    };

    const usersInfo = await fetch(`${fetchUrl}/users/send-reset`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const userObj = await usersInfo.json();
    setLoading(false);
    setResendResponse(userObj);
  };

  const goBack = () => {
    if (window === window.parent) {
      // This would mean we aren't in an iframe
      window.location.replace(process.env.REACT_APP_HOME_URL);
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="container container-border-orange p-4">
        <div className='col-12 text-center'>
          <h3 className="bts-white-bg">Loading</h3>
        </div>
      </div>
    );
  }

  if (resendResponse) {
    return (
      <div className="container container-border-orange p-4">
        <div className='col-12 text-center'>
          {resendResponse.code === '200' ? (
            <div>
              <h3 className="bts-white-bg">Reset email sent. Please check your email and follow the link.</h3>
              <button className="btn detail-btn" onClick={goBack}>Back to Events</button>
            </div>
          ) : (
            <div>
              <h3 className="bts-white-bg">Sorry, an error occurred. Please try again.</h3>
              <p>Message: {JSON.stringify(resendResponse.message)}</p>
              <button className="btn detail-btn" onClick={() => resendEmail(resendResponse.email)}>Send another one!</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (resetResponse) {
    return (
      <div className="container container-border-orange p-4">
        <div className='col-12 text-center'>
          {resetResponse.code === '200' ? (
            <div>
              <h3 className="bts-white-bg">Your password has been reset. You may now log in!</h3>
              <button className="btn detail-btn" onClick={goBack}>Back to Events</button>
            </div>
          ) : (
            <div>
              <h3 className="bts-white-bg">Sorry, an error occurred. Please try again.</h3>
              <p>Message: {JSON.stringify(resetResponse.message)}</p>
              <button className="btn detail-btn" onClick={() => resendEmail(resetResponse.email)}>Send another one!</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container container-border-orange p-4">
      <div className='col-12 text-center'>
        <h2 className="bts-white-bg">Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
            />
            <small style={{ color: 'red' }}>{values.passwordError}</small>
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={values.confirmPassword}
              onChange={handleChange}
            />
            <small style={{ color: 'red' }}>{values.confirmPasswordError}</small>
          </div>
          <button className="btn detail-btn" type="submit">Submit</button>
          <button className="btn detail-btn ml-2" type="button" onClick={goBack}>Back to Events</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPage;
