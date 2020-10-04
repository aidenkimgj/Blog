import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import { Back_And_Close } from './index.js';
import axios from 'axios';

class search_pw extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: false,
      secret: "",
      user_data: [],
      change: false,
    }
  }
  _searchPassword = async () => {
    const user_id = document.getElementsByName('search_pw_id')[0].value;
    const user_email = document.getElementsByName('search_pw_email')[0].value; 

    const id_check = /^[a-zA-Z]+[a-zA-Z0-9]{5,19}$/g;
    const email_check = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    if(!id_check.test(user_id)) {
      return alert('ID must be 6 to 20 letters starting with letter!');
    }

    if(!user_email.match(email_check)) {
      return alert('Please enter a valid email format!');
    }

    const obj = {id: user_id, email: user_email};
    const res = await axios('/search/pw', {
      method: 'POST',
      data: obj,
      headers: new Headers()
    });
    console.log('password check',res);

    document.getElementsByName('search_pw_id')[0].value = "";
    document.getElementsByName('search_pw_email')[0].value = "";
    
    if(res.data === false) {
      return alert('No matching data found, Please check again.');
    }
    alert(`A 6-digit OTP code has been sent to ${res.data.result[0].email}.`);
    this.setState({result: true, 
                  secret: res.data.secret, 
                  user_data: res.data.result[0]});
    
  }

  _checkSecretCode = () => {
    const secret_code = Number(this.state.secret);
    const secret_input = Number(document.getElementsByName('pw_secret')[0].value.trim());
    console.log('code:',secret_code,'mytype:',secret_input)
    
    if (secret_code !== secret_input) {
      return alert('The number entered does not match the OTP code!');
    }
    return this.setState({change: true});

  }

  _changePassword = async () => {
    const change_password = document.getElementsByName('change_password')[0].value.trim();
    const check_change_password = document.getElementsByName('check_change_password')[0].value.trim();

    const pw_check = /^[a-zA-Z]+[a-zA-Z0-9]{5,19}$/g;

    if(!pw_check.test(change_password)) {
      return alert('Password must be 6 to 20 letters starting with letter!');
    } else if (change_password !== check_change_password) {
      return alert('Password and Confirmation Password do not match!');
    }

    const user_id = this.state.user_data.id;
    console.log(user_id)
    const obj = {user_id: user_id, change_password: change_password};
    const res = await axios('/update/password', {
      method: 'POST',
      data: obj,
      headers: new Headers()
    });
    console.log(res.data);
    if(res.data.length !== 1) {
      return alert('Failed to change password.\nPlease try again.');
    }

    alert('The password has been changed.');
    this.setState({result: false, change: false});
    return this.props._backSearchModal(this.props.target);
  }
  
  _resetPWResult = () => {
    this.setState({result: false, change: false});
  }

  render() {
    const {_closeSearchModal, _backSearchModal, target} = this.props;
    const {_resetPWResult} = this;
    const {result, user_data, change} = this.state

    return (
        <div>
            <Modal visible={this.props.search_pw_modal} 
                    width="400" height="380"
                    effect="fadeInDown" 
                >
              <Back_And_Close
                _closeSearchModal={_closeSearchModal}
                _backSearchModal={_backSearchModal}
                _resetPWResult={_resetPWResult}
                target={target}
              />
              {!result ? 
              <div className='Search_pw_div'>
                <h4>Find Password</h4>
                <div>
                  <h5>Username</h5>
                  <input type='text' maxLength='20' name='search_pw_id' placeholder='Enter your username'/>
                </div>

                <div id='email'>
                  <h5>Email</h5>
                  <input type='text' maxLength='30' name='search_pw_email' placeholder='Enter your email'/>
                </div>

                <div>
                  <input type='button'  value='Search' name='search_pw_submit' onClick={() => this._searchPassword()}/>
                </div>
              </div> : 
              
              !change ? 
              <div className='search_result_div'>
                <h4>Find Password</h4>
                <p>Please type the 6-digit OTP code <br/> which has been sent to <b>{user_data.email}</b> in the input box below.</p>
                <input type='text' maxLength='6' name='pw_secret' placeholder='Please type the 6-digit OTP code'/>
                <input type='button' value='Confirm' name='pw_secret_submit' onClick={() => this._checkSecretCode()}/>
              </div> : 
              
              <div className='change_password_div'>
                <h4>Password Change</h4>
                <div>
                  <span>
                    Please type a password that you woluld like to change.
                    <p>(The password must be 6 to 20 letters starting with letter)</p>
                  </span>

                  <div>
                    <h5>Password</h5>
                    <input type='password' name='change_password' maxLength='20' placeholder='Enter Password'/>
                  </div>

                  <div>
                    <h5>Confirm Password</h5>
                    <input type='password' name='check_change_password' maxLength='20' placeholder='Repeat Password'/>
                  </div>

                  <input type='button' value='Confirm' name='change_password_submit' onClick={() => this._changePassword()}/>
                </div>
              </div>
              } 
            </Modal>
        </div>
    );
  }
}

export default search_pw;