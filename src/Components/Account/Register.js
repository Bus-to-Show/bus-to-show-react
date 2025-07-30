import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {sha256} from 'js-sha256';

import {sendRequest} from '../../api';
import {useStore} from '../../Store';
import {validatePasswordComplexity} from '../../validation';

// TODO: add links to reset password and resend email
const Register = () => {
  const navigate = useNavigate()

  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [success, setSuccess] = useState();
  const [validationErrors, setValidationErrors] = useState({});

  const [inputs, setInputValues] = useState({
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    confirmPassword: null,
  });

  const {btsUser} = useStore();

  useEffect(() => {
    if (btsUser.isLoggedIn) {
      navigate('/');
    }
  }, [btsUser]);

  const onChange = (event) => {
    setInputValues({
      ...inputs,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const register = async (event) => {
    event.preventDefault();

    setError();

    if (!validate()) {
      return;
    }

    setLoading(true);

    const result = await sendRequest({
      path: 'users',
      data: {
        firstName: inputs.firstName,
        lastName: inputs.lastName,
        email: inputs.email,
        hshPwd: sha256(inputs.password),
      },
      method: 'POST',
    });

    setLoading(false);

    if (result.error) {
      setError(`Unable to register: ${result.error}`);
      return;
    }

    setSuccess(`Please check your email for a message from Bus to Show and follow the instructions
      to verify your email address.`);
  };

  const validate = () => {
    const errors = {};

    if (!inputs.firstName) {
      errors.firstName = 'Please enter your first name.';
    }

    if (!inputs.lastName) {
      errors.lastName = 'Please enter your last name.';
    }

    if (!inputs.email) {
      errors.email = 'Please enter your email address.';
    }

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

  return (
    <>
      <h3 className="text-center">Register</h3>
      <div className="text-center">
        Already have an account?
        <button className="btn btn-link" onClick={() => navigate('/login')}>
          Log In
        </button>
      </div>
      <form>
        <div className="form-group">
          <label htmlFor="firstName">First name</label>
          <input type="text" className="form-control" id="firstName" name="firstName"
            onChange={onChange} />
          {validationErrors.firstName && (
            <div className="validation-error">{validationErrors.firstName}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last name</label>
          <input type="text" className="form-control" id="lastName" name="lastName"
            onChange={onChange} />
          {validationErrors.lastName && (
            <div className="validation-error">{validationErrors.lastName}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input type="email" className="form-control" id="email" name="email"
            onChange={onChange} />
          {validationErrors.email && (
            <div className="validation-error">{validationErrors.email}</div>
          )}
        </div>
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
        <button className="btn btn-primary" disabled={loading} onClick={register}>
          Register
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

export default Register;
