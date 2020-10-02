import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import { Back_And_Close } from './index.js';
import axios from 'axios';

class search_pw extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: false,
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
    if(res.data.length ===0) {
      document.getElementsByName('search_pw_id')[0].value = "";
      document.getElementsByName('search_pw_email')[0].value = "";
      return alert('No matching data found, Please check again.');
    }
    this.setState({result: res.data});
    console.log(res.data)
  }

  render() {
    const {_closeSearchModal, _backSearchModal, target} = this.props;
    const {result} = this.state

    return (
        <div>
            <Modal visible={this.props.search_pw_modal} 
                    width="400" height="380"
                    effect="fadeInDown" 
                >
              <Back_And_Close
                _closeSearchModal={_closeSearchModal}
                _backSearchModal={_backSearchModal}
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
              <div>
                <div className='search_result_div'>
                  <h4>Find Password</h4>
                  <p>Password has been sent to email( {result[0].email} )</p>
                </div>
              </div>}
            </Modal>
        </div>
    );
  }
}

export default search_pw;