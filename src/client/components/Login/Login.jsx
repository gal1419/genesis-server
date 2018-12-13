import React from 'react';
import { BrowserRouter as Redirect } from 'react-router-dom';
import AuthService from '../../services/AuthService';

export default class Login extends React.Component {
  state = {
    redirectToReferrer: false
  };

  login = () => {
    AuthService.authenticate(() => {
      this.setState(() => ({
        redirectToReferrer: true
      }));
    });
  };

  render() {
    const {
      location: {
        state: { from }
      }
    } = this.props || { from: { pathname: '/' } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer === true) {
      return <Redirect to={from} />;
    }

    return (
      <div>
        <p>You must log in to view the page</p>
        <button type="button" onClick={this.login}>
          Log in
        </button>
      </div>
    );
  }
}
