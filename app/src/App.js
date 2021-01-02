import React, { useState, useEffect } from 'react';
import './App.css';
import ApplicationViews from './component/ApplicationViews';
import Login from './component/auth/Login';
import UserContext from './context/UserContext';
import AuthManager from './modules/AuthManager';

const App = (props) =>{
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
    authenticated: false
  });

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem('auth-token');
      if (token === null) {
        localStorage.setItem('auth-token', '');
        token = '';
      }
      const tokenIsValidRequest = await AuthManager.checkUserVerified(token);
      const tokenIsValid = await tokenIsValidRequest.json();

      if(tokenIsValid) {
        const userRequest = await AuthManager.getCurrentUser(token);
        const user = await userRequest.json();
        setUserData({
          token,
          user,
          authenticated: true
        });
      }
    };

    checkLoggedIn();
  }, []);

    // let isAuthenticated = () => sessionStorage.getItem('activeUser') !== null;

    const setUser = (loginResult) => {
      const token = loginResult.token;
      const user = loginResult.user;

      sessionStorage.setItem('activeUser', user.id);
      sessionStorage.setItem('userEmail', user.email);
      localStorage.setItem('auth-token', token);

      setUserData({
        token,
        user,
        authenticated: true
      });

      // this.setState({
      //   activeUser: this.getUser(),
      //   user: true,
      //   email: this.getEmail()
      // });
    };

    const getUser = () => {
        if (sessionStorage.getItem('activeUser')) {
            return sessionStorage.getItem('activeUser');
        } else {
            return '';
        }
    }

    // const getEmail = () => {
    //     if (sessionStorage.getItem('userEmail')) {
    //         return sessionStorage.getItem('userEmail');
    //     } else {
    //         return '';
    //     }
    // }

    // let state = {
    //   user: sessionStorage.getItem('activeUser') !== null,
    //   activeUser: getUser(),
    //   email: getEmail()
    // };

    const clearUser = () => {
        sessionStorage.removeItem('activeUser');
        sessionStorage.removeItem('userEmail');
        localStorage.setItem('auth-token', '');
        setUserData({
          token: undefined,
          user: undefined,
          authenticated: false
        });

        // this.setState({
        //     user: isAuthenticated()
        // });
    };
        // console.log('app.js user', this.state.activeUser);
        return (
            <div className='App'>
              <UserContext.Provider value={{ userData, setUserData}}>
                {userData.user ? (
                    <>
                        <ApplicationViews
                            isAuthenticated={userData.authenticated}
                            {...props}
                            user={userData.user}
                            clearUser={clearUser}
                        />
                    </>
                ) : (
                    <Login
                        getUser={getUser}
                        setUser={setUser}
                        {...props}
                    />
                )}
              </UserContext.Provider>
            </div>
        );
}

export default App;
