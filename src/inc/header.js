import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import '../App.css';
import { Login, SignUp} from './index';


class header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      id: "",
      password: "",
    }
  }

  _openModal = () => {
    return this.props._toggleModal(true);
  }

  _logout = () => {
    if(window.confirm('Would like to logout?')) {
      this.props._logout();
    }
  }

  _categorySessionRemove = () => {
    sessionStorage.removeItem('category');
    return window.location.replace('/');
  }

  render() {
    const {login, admin, user_ip, ip, _login, login_modal, _toggleModal} = this.props;
    
    return (
        <div className='header_grid'>
          <div className='acenter'> 
            {login && admin === 'Y' && user_ip === ip ? <h5><Link to ='/write'>Post</Link></h5> : null}
          </div>
          
          <div className='acenter'>
            
              <Route path='/'/> 
              <Link className='link_tit' to='/' onClick={() => this._categorySessionRemove()}> 
                <h3> Aiden's Blog </h3> 
              </Link>
          </div>

          <div className='acenter'> 
            <ul className='btn_list'>
              {login ? <li className='btn_cursor' onClick={() => this.props._logout()}>Logout</li> : <li className='btn_cursor' onClick={() => this._openModal()}>Login</li>}
              
              <Login _login={_login} login_modal={login_modal} _toggleModal={_toggleModal}/>  
              
              
              {!login ? <li className='link_tit' onClick={() => this._openModal()}>Sign up</li>: null}

              <SignUp signup_modal={login_modal}/>
            </ul>
          </div>
        </div>
    );
  }
}

export default header;

