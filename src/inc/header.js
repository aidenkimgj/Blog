import React, { Component } from 'react';
import { SignUp } from '../page';
import { Route, Link } from 'react-router-dom';
import '../App.css';
import axios from 'axios';

import Modal from 'react-awesome-modal';

class header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      id: "",
      password: "",
    }
  }

  _openModal = function() {
    this.setState({
      visible: true
    });
  }

  _closeModal = function() {
    this.setState({
      visible: false
    });
  }

  _changeID = () => {
    const _id = document.getElementsByName('id')[0].value;
    
    this.setState({id: _id});
  }

  _changePW = () => {
    const _password = document.getElementsByName('password')[0].value;
    this.setState({password: _password});
  }

  _selectUserData = async (e) => {
    const _id = this.state.id.trim();
    const _password = this.state.password.trim();

    if(_id === "") {
      return alert('Please enter your ID.');
    } else if(_password === "") {
      return alert('Please enter your Password.');
    }

    const obj = {id: _id, password: _password}
    const res = await axios('/send/pw', {
      method: 'POST',
      data: obj,
      headers: new Headers()
    }); 

    if(res.data) {
      console.log(res.data.msg);
      
      if(res.data.suc) {
        this.props._login(res.data);
        this._closeModal();
        return alert('You have been logged in.');
      } else {
        return alert('You may have entered an incorrect ID and/or Password');
      }
    } 
  }

  _logout = () => {
    if(window.confirm('Would like to logout?')) {
      this.props._logout();
    }
  }

  render() {
    const {login, admin, user_ip, ip} = this.props;
    
    return (
        <div className='header_grid'>
          <div className='acenter'> 
            {login && admin === 'Y' && user_ip === ip ? <h5><Link to ='/write'>Post</Link></h5> : null}
          </div>
          
          <div className='acenter'>
            
              <Route path='/'/> 
              <Link className='link_tit' to='/'> 
                <h3> Aiden's Blog </h3> 
              </Link>
          </div>

          <div className='acenter'> 
            <ul className='btn_list'>
              {login ? <li className='btn_cursor' onClick={() => this.props._logout()}>Logout</li> : <li className='btn_cursor' onClick={() => this._openModal()}>Login</li>}
              
                <Modal  visible={this.state.visible} 
                        width="400" 
                        height="360" 
                        effect="fadeInDown" 
                        onClickAway={() => this._closeModal()}>
                  <div>
                    <h4 className='acenter login_tit'> Administrator Login </h4>
                    <form>
                      <div className='login_div'>
                        <div className = 'login_input_div'>
                          <p> Administrator ID </p>
                          <input type='text' name='id' onChange={() => this._changeID()}/>
                        </div>
                        
                        <div className='login_input_div' id='password'>
                          <p> Administrator Password </p>
                          <input type='password' name='password' onChange={() => this._changePW()}/>    
                        </div>

                        <div className='submit_div'>
                          <div> <input type='button' value='Login' onClick={() => this._selectUserData()}/></div>
                          <div> <input type='button' value='Cancel' onClick={() => this._closeModal()}/></div>
                        </div>
                      </div>
                    </form>
                  </div>
                </Modal>
              
              <Route path='/signup' component={SignUp} />
              {!login ? <li><Link className='link_tit' to='/signup'> 
              Sign Up 
              </Link></li>: null}
            </ul>
          </div>
        </div>
    );
  }
}

export default header;

