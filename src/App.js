import "./styles/App.css";
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
import { Profile } from "./components/Profile";
import SendingPDF from "./components/SendingPDF";
import AllDocsToSign from "./components/AllDocsToSign";
import SendToBucketAndUser from "./components/SendToBucketAndUser";
import TimeToSign from "./components/TimeToSign";
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
      <AuthApi.Provider
        value={{ auth, setAuth, loggedInUser, setLoggedInUser }}
      >
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
      <ProtectedLogin path="/" exact auth={Auth.auth} component={Login} />
      <ProtectedLogin path="/signup" auth={Auth.auth} component={Signup} />
      <ProtectedRoute path="/nav" auth={Auth.auth} component={Navbar} />
      <ProtectedRoute
        path="/nav/dashboard"
        auth={Auth.auth}
        component={Dashboard}
      />
      <ProtectedRoute
        path="/nav/profile"
        auth={Auth.auth}
        component={Profile}
      />
      <ProtectedRoute
        path="/nav/viewer"
        exact
        auth={Auth.auth}
        component={SendingPDF}
      />
      <ProtectedRoute path="/nav/viewer/sent" auth={Auth.auth} component={SendToBucketAndUser} />
      <ProtectedRoute path="/nav/signdocuments" auth={Auth.auth} exact component={AllDocsToSign} />
      <ProtectedRoute path="/nav/signdocuments/signaturetime" auth={Auth.auth} component={TimeToSign} />
    </div>
  );
};

const ProtectedRoute = ({ auth, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (auth ? <Component /> : <Redirect to="/" />)}
    />
  );
};

const ProtectedLogin = ({ auth, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        !auth ? <Component {...props} /> : <Redirect to="/nav/dashboard" />
      }
    />
  );
};

export default App;
