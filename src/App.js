import React, { Component } from "react";
import "./App.css";
import { Head } from './inc';
import { Main } from './page';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
    }
  }

  componentDidMount() {
    if(sessionStorage.login) {
      this.setState({login: true});
    }
  }

  _login = () => {
    this.setState({login: true});
    return sessionStorage.setItem('login', true);
  }

  _logout = () => {
    this.setState({login: false});
    return sessionStorage.removeItem('login');
  }

  render() {
    const {login} = this.state;
    const {_login, _logout} = this;

    return(
      <div className='App'>
        <div>
          <Head login={login} _login={_login} _logout={_logout} />
        </div>

        <div>
          <Main login={login} />
        </div>
      </div>

    )
  }
}

export default App;
