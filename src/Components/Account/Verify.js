import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

import {sendRequest} from '../../api';

// TODO: add links to register and resend email
const Verify = () => {
  const {token} = useParams();

  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  useEffect(() => {
    verifyEmail();
  });

  const verifyEmail = async () => {
    const result = await sendRequest({
      path: `users/confirm-email/${token}`,
    });

    if (result.error) {
      setError(`Unable to verify email: ${result.error}`);
      return;
    }

    setSuccess('Your email address has been verified. Please log in.');
  };

  if (error) {
    return <div className="alert alert-danger" role="alert">{error}</div>;
  }

  if (success) {
    return <div className="alert alert-success" role="alert">{success}</div>;
  }

  return <div className="loading"></div>;
};

export default Verify;
