import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import { Back_And_Close } from './index.js';

class search_pw extends Component {
  render() {
    const {_closeSearchModal, _backSearchModal, target} = this.props;

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
            </Modal>
        </div>
    );
  }
}

export default search_pw;