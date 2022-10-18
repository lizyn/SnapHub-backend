import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  AuthProvider.propTypes = {
    children: PropTypes.func.isRequired
  };
  const [auth, setAuth] = useState({});

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
