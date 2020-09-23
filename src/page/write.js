import React, { Component } from 'react';
import { CKEditor } from '../inc/index.js';
import './main.css'

class write extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div className='Write'>
        <div id='Title'>
          <input type='text' id='title_txt' name='title' placeholder='Title'/>
        </div>

        <div>
          {/* <textarea id='content_txt' name='contents' placeholder='Please write here'></textarea> */}
          <CKEditor /> 
        </div>
      </div>
    );
  }
}

export default write;