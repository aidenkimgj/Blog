import React, { Component } from "react";
import "./App.css";
import axios from 'axios';
import { Head } from './inc';
import { Main } from './page';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      admin: false,
      user_ip: "",
      signup: false,
      ip: "",
    }
  }

  componentDidMount() {
    if(sessionStorage.login && sessionStorage.IP) {
      this.setState({login: JSON.parse(sessionStorage.login).id,
                    admin: JSON.parse(sessionStorage.login).admin,
                    user_ip: JSON.parse(sessionStorage.IP)
      });
    }
    this._getIP();
  }
  _getIP = async () => {
    const _ip = await axios('/get/ip');
    console.log(_ip);
    this.setState({ip: _ip.data});
  }

  _login = (data) => {
    sessionStorage.setItem('login', JSON.stringify(data.suc));
    sessionStorage.setItem('IP', JSON.stringify(data.ip));
    this.setState({login: JSON.parse(sessionStorage.login).id,
                  admin: JSON.stringify(data.suc).admin,
                  user_ip: JSON.parse(sessionStorage.IP)
    });
    return window.location.reload();
  }

  _logout = () => {
    this.setState({login: false, admin: false, user_ip: ""});
    sessionStorage.removeItem('login');
    sessionStorage.removeItem('IP');

  }

  render() {
    const {login, admin, user_ip, ip} = this.state;
    const {_login, _logout} = this;

    return(
      <div className='App'>
        <div>
          <Head login={login} admin={admin} user_ip={user_ip} _login={_login} _logout={_logout} ip={ip} />
        </div>

        <div>
          <Main admin={admin} user_ip={user_ip} login={login} ip={ip} />
        </div>
      </div>

    )
  }
}

export default App;
