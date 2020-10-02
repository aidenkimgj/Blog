import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import { Back_And_Close } from './index.js';
import axios from 'axios';

class search_un extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: false,
    }
  }
  _searchUserID = async () => {
    const user_email = document.getElementsByName('search_id_email')[0].value; 
    console.log(user_email);
    const email_check = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    if(!user_email.match(email_check)) {
      alert('Please input a valid email format!');
    }

    const res = await axios('/search/id', {
      method: 'POST',
      data: {email: user_email},
      headers: new Headers()
    });
    
    if(res.data.length === 0) {
      document.getElementsByName('search_id_email')[0].value = "";
      return alert('No matching data found, Please check again.');
    }
      this.setState({result: res.data});
        
  }

  _resetIDResult = () => {
    this.setState({result: false})
  }

  render() {
    const {_closeSearchModal, _backSearchModal, target} = this.props;
    const {result} = this.state;
    const {_resetIDResult} = this;
    return (
        <div>
            <Modal visible={this.props.search_un_modal} 
                    width="400" height="380"
                    effect="fadeInDown" 
                >
              <Back_And_Close
                _closeSearchModal={_closeSearchModal}
                _backSearchModal={_backSearchModal}
                target={target}
                _resetIDResult={_resetIDResult}
              />  
              {!result ? 
              <div className='Search_id_div'>
                <h4>Find Username</h4>
                <div>
                  <h5>Email</h5>
                  <input type='text' maxLength='30' name='search_id_email' placeholder='Enter your email'/>
                </div>
                
                <div>
                  <input type='button'  value='Search' name='search_id_submit' onClick={() => this._searchUserID()}/>
                </div>
              </div> :
              
              <div>
                <h4>User Information</h4>

                <div className='Search_id_result'>
                  <div>
                      <h5>Username</h5>
                      {result[0].id}
                    </div>

                    <div>
                      <h5>Signup Date</h5>
                      {result[0].signup_date.slice(0, 10)}
                    </div>
                </div>
              </div>}
              
            </Modal>
        </div>
    );
  }
}

export default search_un