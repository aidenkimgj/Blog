import React, { Component } from 'react';
import { CKEditor } from '../inc/index.js';
import './main.css'

class write extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {_getContents, contents} = this.props;

    return(
      <div className='Write'>
        <div id='Title'>
          <input type='text' id='title_txt' name='title' placeholder='Title'/>
        </div>

        <div>
          <CKEditor _getContents = {_getContents} contents={contents} /> 
        </div>
      </div>
    );
  }
}

export default write;