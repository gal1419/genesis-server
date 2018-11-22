import React, { Component } from 'react';
import fetch from 'cross-fetch';

class MainArea extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    fetch('/api/locations').then(loc => console.log(loc));
  }

  render() {
    return <div className="home-page-container">Hello</div>;
  }
}

export default MainArea;
