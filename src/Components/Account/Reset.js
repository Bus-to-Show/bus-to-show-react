import React, {useState} from 'react';
import {useParams} from 'react-router-dom';

import {sha256} from 'js-sha256';

import {sendRequest} from '../../api';
import {validatePasswordComplexity} from '../../validation';

// TODO: add links to register and resend email
const Reset = () => {
  const {token} = useParams();

  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [success, setSuccess] = useState();
  const [validationErrors, setValidationErrors] = useState({});

  const [inputs, setInputValues] = useState({
    email: null,
    password: null,
    confirmPassword: null,
  });

  const onChange = (event) => {
    setInputValues({
      ...inputs,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const sendEmail = async (event) => {
    event.preventDefault();

    setError();

    if (!validateEmail()) {
      return;
    }

    setLoading(true);

    const result = await sendRequest({
      path: 'users/send-reset',
      data: {
        username: inputs.email,
      },
      method: 'POST',
    });

    setLoading(false);

    if (result.error) {
      setError(`Unable to send email: ${result.error}`);
      return;
    }

    setSuccess(`Please check your email for a message from Bus to Show and follow the instructions
      to update your password.`);
  };

  const validateEmail = () => {
    const errors = {};

    if (!inputs.email) {
      errors.email = 'Please enter your email address.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const updatePassword = async (event) => {
    event.preventDefault();

    setError();

    if (!validatePassword()) {
      return;
    }

    setLoading(true);

    const result = await sendRequest({
      path: 'users/reset-pass',
      data: {
          hshPwd: sha256(inputs.password),
          resetToken: token,
      },
      method: 'POST',
    });

    setLoading(false);

    if (result.error) {
      setError(`Unable to update password: ${result.error}`);
      return;
    }

    setSuccess('Your password has been updated. Please log in.');
  };

  const validatePassword = () => {
    const errors = {};

    if (!inputs.password) {
      errors.password = 'Please enter your password.';
    } else if (!validatePasswordComplexity(inputs.password)) {
      errors.password = `Password must be at least 8 characters and must contain a special character,
        an uppercase letter, a lowercase letter, and a number.`;
    }

    if (!inputs.confirmPassword) {
      errors.confirmPassword = 'Please enter your password again.';
    } else if (inputs.password !== inputs.confirmPassword) {
      errors.confirmPassword = 'Password and confirm password must be the same';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  if (success) {
    return <div className="alert alert-success" role="alert">{success}</div>;
  }

  if (!token) {
    return (
      <>
        <h3 className="text-center">Reset Password</h3>
        <form>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input type="email" className="form-control" id="email" name="email"
              onChange={onChange} />
            {validationErrors.email && (
              <div className="validation-error">{validationErrors.email}</div>
            )}
          </div>
          <button className="btn btn-primary" disabled={loading} onClick={sendEmail}>
            Send
          </button>
          {loading && (
            <div className="loading mt-3"></div>
          )}
          {error && (
            <div className="alert alert-danger mt-3" role="alert">{error}</div>
          )}
        </form>
      </>
    );
  }

  return (
    <>
      <h3 className="text-center">Reset Password</h3>
      <form>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" className="form-control" id="password" name="password"
            onChange={onChange} />
          {validationErrors.password && (
            <div className="validation-error">{validationErrors.password}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input type="password" className="form-control" id="confirmPassword" name="confirmPassword"
            onChange={onChange} />
          {validationErrors.confirmPassword && (
            <div className="validation-error">{validationErrors.confirmPassword}</div>
          )}
        </div>
        <button className="btn btn-primary" disabled={loading} onClick={updatePassword}>
          Update
        </button>
        {loading && (
          <div className="loading mt-3"></div>
        )}
        {error && (
          <div className="alert alert-danger mt-3" role="alert">{error}</div>
        )}
      </form>
    </>
  );
};

export default Reset;
