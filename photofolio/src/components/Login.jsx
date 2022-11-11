import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
import LoginImage from './LoginImage';
import './Login.css';

function Login() {
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:3500/account');
      const example = response.data;
      console.log(example);
      const result = example.filter((x) => x.user === user && x.pwd === pwd);
      console.log(result);
      setUser('');
      setPwd('');
      setSuccess(true);
    } catch (err) {
      if (!err.response) {
        setErrMsg('No Server Response');
      } else if (err.response.status === 400) {
        setErrMsg('Missing Username or Password');
      } else {
        setErrMsg('Login Failed');
      }
      errRef.current.focus();
    }
  };

  return (
    <div className="login-main">
      <LoginImage />
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <Link to="/home">Go to Homepage</Link>
          </p>
        </section>
      ) : (
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
      )}
    </div>
  );
}

export default Login;
