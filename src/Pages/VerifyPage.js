import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { sha256 } from 'js-sha256';

const fetchUrl = `${process.env.REACT_APP_API_URL}`;

const VerifyPage = (props) => {
  const verifyEmailUrl = `${fetchUrl}/users/confirm-email`;
  const { token } = useParams();
  const [verifiedResponse, setVerifiedResponse] = useState(null);
  const [email, setEmail] = useState('');
  const [resentResponse, setResentResponse] = useState(null);

  const resendVerificationEmail = async () => {
    const body = {
      email: email,
      password: 'none',
      resendEmail: true,
    };

    body.hshPwd = sha256(body.password);

    const usersInfo = await fetch(`${fetchUrl}/users`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const userObj = await usersInfo.json();
    setResentResponse(userObj);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${verifyEmailUrl}/${token}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
      });

      const json = await response.json();
      setVerifiedResponse(json);
      setEmail(json.email);
      return;
    };

    fetchData();
  }, [token]);

  if (resentResponse) {
    return (
      <div className="container container-border-orange p-4">
        <div className='col-12 text-center'>
          {resentResponse.code === '200' ? (
            <div>
              <h3 className="bts-white-bg">Verification email sent. Please check your email and follow the link.</h3>
              <button className="btn detail-btn" onClick={() => props.history.push('/')}>Go to Dashboard</button>
            </div>
          ) : (
            <div>
              <h3 className="bts-white-bg">Sorry, an error occurred. Please try again.</h3>
              <p>Message: {JSON.stringify(resentResponse.message)}</p>
              <button className="btn detail-btn" onClick={resendVerificationEmail}>Send another one!</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (verifiedResponse) {
    return (
      <div className="container container-border-orange p-4">
        <div className='col-12 text-center'>
          {verifiedResponse.code === '200' ? (
            <div>
              <h3 className="bts-white-bg">Your account has been verified. You may now log in!</h3>
              <button className="btn detail-btn" onClick={() => props.history.push('/')}>Go to Dashboard</button>
            </div>
          ) : (
            <div>
              <h3 className="bts-white-bg">Sorry, an error occurred. Please try again.</h3>
              <p>Message: {JSON.stringify(verifiedResponse.message)}</p>
              <button className="btn detail-btn" onClick={resendVerificationEmail}>Send another one!</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container container-border-orange p-4">
      <div className='col-12 text-center'>
        <h3 className="bts-white-bg">Loading</h3>
      </div>
    </div>
  );
}

export default VerifyPage
