import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import { ViewInfo } from "./components/ViewInfo";
import DocManager from "./components/DocManager";
import React, { useState, useContext, useEffect } from "react";
import AuthApi from "./AuthApi";
import Cookies from "js-cookie";

function App() {
  const [auth, setAuth] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState("");

  const readCookie = () => {
    const user = Cookies.get("user");
    if (user) {
      setAuth(true);
    }
  };

  useEffect(() => {
    readCookie();
  }, []);

  return (
    <div className="App">
      <AuthApi.Provider value={{ auth, setAuth, loggedInUser, setLoggedInUser}}>
        <Router>
          <Switch>
            <Routes />
          </Switch>
        </Router>
      </AuthApi.Provider>
    </div>
  );
}

const Routes = () => {
  const Auth = useContext(AuthApi);
  return (
    <div>
      <ProtectedLogin path="/" exact auth={Auth.auth} loggedInUser={Auth.loggedInUser} component={Login} />
      <ProtectedLogin path="/signup" auth={Auth.auth} loggedInUser={Auth.loggedInUser} component={Signup} />
      <ProtectedRoute path="/nav" auth={Auth.auth} loggedInUser={Auth.loggedInUser} component={Navbar} />
      <ProtectedRoute path="/nav/dashboard" auth={Auth.auth} loggedInUser={Auth.loggedInUser} component={Dashboard} />
      <ProtectedRoute path="/nav/profile" auth={Auth.auth} loggedInUser={Auth.loggedInUser} component={ViewInfo} />
      <ProtectedRoute path="/nav/viewer" exact auth={Auth.auth} loggedInUser={Auth.loggedInUser} component={DocManager} />
    </div>
  );
};

const ProtectedRoute = ({ auth, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (auth ? <Component/> : <Redirect to="/" />)}
    />
  );
};

const ProtectedLogin = ({ auth, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (!auth ? <Component {...props} /> : <Redirect to="/nav/dashboard" />)}
    />
  );
};

export default App;
