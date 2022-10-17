import React, { useState, useRef, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
import LoginImage from './LoginImage';
import './Login.css';

const LOGIN_URL = '/login';

function Login() {
  const { setAuth } = useAuth();

  const history = useHistory();
  const location = useLocation();
  const from = location.pathname || '/';

  // const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');

  // useEffect(() => {
  //     userRef.current.focus();
  // }, [])

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      console.log(JSON.stringify(response.data ? response.data : undefined));
      const { accessToken } = response.data;
      const { roles } = response.data;
      setAuth({ user, pwd, roles, accessToken });
      setUser('');
      setPwd('');
      history.push(from, { replace: true });
    } catch (err) {
      if (!err.response) {
        setErrMsg('No Server Response');
      } else if (err.response.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.response.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }
      errRef.current.focus();
    }
  };

  return (
    <div className="login-main">
      <LoginImage />
      <section>
        <p
          ref={errRef}
          className={errMsg ? 'errmsg' : 'offscreen'}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <p className="welcome-text">Welcome to photofolio!</p>
        <p className="signin-text">Sign In</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">
            Username:
            <input
              type="text"
              id="username"
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              // value=""
              required
            />
          </label>
          <label htmlFor="password">
            Password:
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
            />
          </label>
          <button type="submit"> Sign In </button>
        </form>
        <p>
          Need an Account?
          <br />
          <span className="line">
            <Link to="/register">Sign Up</Link>
          </span>
        </p>
      </section>
    </div>
  );
}

export default Login;
