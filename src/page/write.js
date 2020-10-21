import React, { Component } from 'react';
import { CKEditor } from '../inc/index.js';
import './main.css'

class write extends Component {
  constructor(props) {
    super(props)
    
  }
  
  componentDidMount = () => {
    const board_id = this.props.match.params.data;
    
    if(board_id != this.props.board_id) {
      this.props._getModifyData(board_id);
    }
  }
  render() {
    const {_getTitles, title, _getContents, contents} = this.props;

    return(
      <div className='Write'>
        <div id='Title'>
          <input type='text' id='title_txt' name='title' placeholder='Title' defaultValue={title} onBlur={() => _getTitles()}/>
        </div>

        <div>
          <CKEditor _getContents={_getContents} contents={contents} /> 
        </div>
      </div>
    );
  }
}

export default write;