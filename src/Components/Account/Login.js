import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {sha256} from 'js-sha256';

import {sendRequest} from '../../api';
import {useStore} from '../../Store';

const Login = () => {
  const navigate = useNavigate()

  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [validationErrors, setValidationErrors] = useState({});

  const [inputs, setInputValues] = useState({
    email: null,
    password: null,
  });

  const {btsUser, setBtsUser} = useStore();

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

  const login = async (event) => {
    event.preventDefault();

    setError();

    if (!validate()) {
      return;
    }

    setLoading(true);

    const result = await sendRequest({
      path: 'users/login',
      data: {
        username: inputs.email,
        password: sha256(inputs.password),
      },
      method: 'POST',
    });

    setLoading(false);

    if (result.error) {
      setError(`Unable to log in: ${result.error}`);
      return;
    }

    localStorage.setItem('jwt', result.token);

    setBtsUser({
      isLoggedIn: true,
      id: result.id,
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
    });
  };

  const validate = () => {
    const errors = {};

    if (!inputs.email) {
      errors.email = 'Please enter your email address.';
    }

    if (!inputs.password) {
      errors.password = 'Please enter your password.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <>
      <h3 className="text-center">Log In</h3>
      <div className="text-center">
        Don’t have an account yet?
        <button className="btn btn-link" onClick={() => navigate('/register')}>
          Register
        </button>
      </div>
      <form>
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
        <div className="d-flex justify-content-between">
          <button className="btn btn-primary" disabled={loading} onClick={login}>
            Log In
          </button>
          <button className="btn btn-link" disabled={loading} onClick={() => navigate('/reset')}>
            Forgot password?
          </button>
        </div>
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

export default Login;
