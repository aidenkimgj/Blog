import React, { Component } from 'react';

import Modal from 'react-awesome-modal';
import axios from 'axios';

class login extends Component {

  constructor(props) {
    super(props)
    this.state = {
      
      id: "",
      password: "",
    }
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
        this.props._toggleModal(false);
        return alert('You have been logged in.');
      } else {
        return alert('You may have entered an incorrect ID and/or Password');
      }
    } 
  }

  render() {
    return (
        <div>
          <Modal  visible={this.props.login_modal} 
                        width="400" 
                        height="360" 
                        effect="fadeInDown" 
                        onClickAway={() => this.props._toggleModal(false)}>
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
                    <div> <input type='button' value='Cancel' onClick={() => this.props._toggleModal(false)}/></div>
                  </div>
                </div>
              </form>
            </div>
          </Modal>  
        </div>
    )
  }
}

export default login;