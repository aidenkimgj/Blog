import React, { Component } from 'react';
// import '../App.css';
import axios from 'axios';
import Modal from 'react-awesome-modal';

class signup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: true,
      id: "",
      password: "",
      email: "",
      passwordCheck: "",
      close: 'https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../assets/preview/2012/png/iconmonstr-x-mark-8.png&r=0&g=0&b=0',
    }
  }

  _changeID = () => {
    const _id = document.getElementsByName('user_id')[0].value;
    this.setState({id: _id});
  }

  _changePW = () => {
    const _password = document.getElementsByName('user_password')[0].value;
    this.setState({password: _password});
  }

  _changePasswordCheck = () => {
    const _passwordCheck = document.getElementsByName('password_check')[0].value;
    this.setState({passwordCheck: _passwordCheck});
  }

  _changeEmail = () => {
    const _email = document.getElementsByName('email')[0].value;
    this.setState({email: _email});
  }

  _closeModal = function() {
    this.setState({
      visible: true,
    });
    alert('Sign up has been cancelled!');
      return window.location.replace('/');
  }

  _selectNewUserData = async () => {
    const _id = this.state.id.trim();
    const _password = this.state.password.trim();
    const _passwordCheck = this.state.passwordCheck.trim();
    const _email = this.state.email.trim();
    const id_check = /^[a-zA-Z]+[a-zA-Z0-9]{5,19}$/g;
    const pw_check = /^[a-zA-Z]+[a-zA-Z0-9]{5,19}$/g;
    const email_check = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    
    if(!id_check.test(_id)) {
      return alert('ID must be 6 to 20 letters starting with letter!');
    }

    if(!pw_check.test(_password)) {
      return alert('Password must be 6 to 20 letters starting with letter!');
    } else if (_password !== _passwordCheck) {
      return alert('Password and Confirmation Password do not match!');
    }
    
    if(!_email.match(email_check)) {
      return alert('Please enter a valid email format!');
    }

    const obj = {id: _id, password: _password, email: _email}

    const add_user = await axios('/add/user', {
      method: 'POST',
      data: obj,
      headers: new Headers()
    });

    if(!add_user) {
      return alert('ID already exists!');
    } else {
      alert('Sign up has been completed.')
      return window.location.replace('/');
    }
  }

  render() {
    
    const {close} = this.state;
    return (
        
      <div>
        <Modal  visible = {this.state.visible} 
                        width="400" 
                        height="500" 
                        effect="fadeInDown" 
                        onClickAway={() => this._closeModal()}>
          <div>
            <h4 className='acenter login_tit'>Sign Up</h4>
            <img src={close} id='login_close' onClick={() => this._closeModal()}/>
            <form>
              <div className='login_div'>
                <div className = 'login_input_div'>
                  <p>Username</p>
                  <input type='text' name='user_id' placeholder='Enter Username' onChange={() => this._changeID()}/>
                </div>
                
                <div className='login_input_div' id='password'>
                  <p>Password</p>
                  <input type='password' name='user_password' placeholder='Enter Password' onChange={() => this._changePW()}/>    
                </div>

                <div className='login_input_div'  id='password_check'>
                  <p>Confirmation Password</p>
                  <input type='password' name='password_check' placeholder='Repeat Password' onChange={() => this._changePasswordCheck()}/>    
                </div>
                
                <div className = 'login_input_div' id='email'>
                  <p>Email</p>
                  <input type='text' name='email' placeholder='Enter Email' onChange={() => this._changeEmail()}/>
                </div>

                <div className='submit_div'>
                  <b id='signup_button' onClick={() => this._selectNewUserData()}>Sign Up</b> 
                  
                </div>
              </div>
            </form>
          </div>
        </Modal>
      </div>
        
    );
  }
}

export default signup;