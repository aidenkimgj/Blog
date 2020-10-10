import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import axios from 'axios';
import { Search_un, Search_pw } from './index'; 

class login extends Component {

  constructor(props) {
    super(props)
    this.state = {
      id: "",
      password: "",
      search_un_modal: false,
      search_pw_modal: false,
      close: 'https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../assets/preview/2012/png/iconmonstr-x-mark-8.png&r=0&g=0&b=0',
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

  _openSearchModal = target => {
    if(target === 'id') {
      this.setState({search_un_modal: true});
    } else if(target === 'pw') {
      this.setState({search_pw_modal: true});
    }
      // return this.props._toggleModal(false);
  }

  _closeSearchModal = target => {
    if(target === 'id') {
      this.setState({search_un_modal: false});
    } else if(target === 'pw') {
      this.setState({search_pw_modal: false});
    }
    return this.props._toggleModal(false);
  }

  _backSearchModal = target => {
    this._closeSearchModal(target);
    return this.props._toggleModal(true);
  }

  render() {
    const {close} = this.state;

    return (
        <div>
          <Modal  visible={this.props.login_modal} 
                  width="400" 
                  height="380" 
                  effect="fadeInDown" 
                  onClickAway={() => this.props._toggleModal(false)}>
            <div>
              <h4 className='acenter login_tit'>Login</h4>
              <img src={close} id='login_close' onClick={() => this.props._toggleModal(false)}/>
              <form>
                <div className='login_div'>
                  <div className = 'login_input_div'>
                    <p> Username </p>
                    <input type='text' name='id' placeholder='Enter Username' onChange={() => this._changeID()}/>
                  </div>
                  
                  <div className='login_input_div' id='password'>
                    <p> Password </p>
                    <input type='password' name='password' placeholder='Enter Password' onChange={() => this._changePW()}/>    
                  </div>

                  <div className='submit_div'>
                    {/* <div> <input type='button' value='Login' onClick={() => this._selectUserData()}/></div> */}
                    <b id='login_button' onClick={() => this._selectUserData()}>Login</b>
                  </div>
                </div>
              </form>

              <div className='search_user_info_div'>
                <div><b className='forget_id' onClick={() => this._openSearchModal('id')}>Forgot Username?</b></div>
                <div><b onClick={() => this._openSearchModal('pw')}>Forgot Password?</b></div>
              </div>
            </div>
          </Modal>  
          
          <Search_un 
            search_un_modal={this.state.search_un_modal}
            _closeSearchModal={this._closeSearchModal}
            _backSearchModal={this._backSearchModal}
            target="id" />
          
          <Search_pw 
            search_pw_modal={this.state.search_pw_modal}
            _closeSearchModal={this._closeSearchModal}
            _backSearchModal={this._backSearchModal}
            target="pw" />
        
        </div>
    )
  }
}

export default login;