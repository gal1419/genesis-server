import React, { Component } from 'react';
import {
  BrowserRouter as Router, Route, Link, Redirect, withRouter
} from 'react-router-dom';
import './app.css';
import MainArea from './components/MainArea/MainArea';
import AdminArea from './components/AdminArea/AdminArea';
import Login from './components/Login/Login';
import AuthService from './services/AuthService';

export default class App extends Component {
  componentDidMount() {}

  render() {
    return (
      <Router>
        <div>
          <AuthButton />
          <ul>
            <li>
              <Link to="/">Public Page</Link>
            </li>
            <li>
              <Link to="/admin">Protected Page</Link>
            </li>
          </ul>
          <Route exact path="/" component={MainArea} />
          <Route path="/login" component={Login} />
          <PrivateRoute exact path="/admin" component={AdminArea} />
        </div>
      </Router>
    );
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (AuthService.isAuthenticated() ? (
      <Component {...props} />
    ) : (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: props.location }
        }}
      />
    ))
    }
  />
);

const AuthButton = withRouter(({ history }) => (AuthService.isAuthenticated() ? (
  <p>
      Welcome!
    <button
      type="button"
      onClick={() => {
        AuthService.signout(() => history.push('/'));
      }}
    >
        Sign out
    </button>
  </p>
) : (
  <p>You are not logged in.</p>
)));
