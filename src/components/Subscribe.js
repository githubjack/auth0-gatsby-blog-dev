// src/componenets/Subscribe.js
import React from 'react';
import Auth from '../utils/auth';
import axios from 'axios';

const wtUri = 'https://wt-a179a849cc8486266a05d8ca7d26adff-0.run.webtask.io/newsletter';
const auth = new Auth();

export default class Subscribe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subscribed: this.isSubscribed()
    };
  }

  isSubscribed() {
    return (localStorage.getItem('subscribed') == 'true');
  }

  isIdentified() {
    return auth.getUser() && auth.isAuthenticated();
  }

  componentDidMount() {
    if (this.isIdentified() && localStorage.getItem('subscribed') === null) {
      const token = localStorage.getItem('access_token');
      axios.get(`${wtUri}/subscribed`, {headers: {"Authorization" : `Bearer ${token}`}})
        .then(res => {
          localStorage.setItem('subscribed', (res.data.status == 'subscribed'));
          this.setState({
            subscribed: this.isSubscribed()
          });
        })
        .catch(console.error);
    }
  }

  subscribe() {
    if (this.isIdentified()) {
      const token = localStorage.getItem('access_token');
      axios.get(`${wtUri}/subscribe`, {headers: {"Authorization" : `Bearer ${token}`}})
        .then(res => {
          localStorage.setItem('subscribed', 'true');
          this.setState({
            subscribed: this.isSubscribed()
          });
        })
        .catch(console.error);
    }
  }

  unsubscribe() {
    if (this.isIdentified()) {
      const token = localStorage.getItem('access_token');
      axios.get(`${wtUri}/unsubscribe`, {headers: {"Authorization" : `Bearer ${token}`}})
        .then(res => {
          localStorage.removeItem('subscribed');
          this.setState({
            subscribed: false
          });
        })
        .catch(console.error);
    }
  }

  render() {
    if (this.state.subscribed) {
      return (
        <a href="#"
           onClick={this.unsubscribe.bind(this)}
        >Unsubscribe</a>
      )
    } else {
      return (
        <a href="#"
           onClick={this.subscribe.bind(this)}
        >Subscribe</a>
      )
    }
  }
}