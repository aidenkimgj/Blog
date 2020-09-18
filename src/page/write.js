import React, {Component} from 'react';

class write extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div className='Write'>
        <div>
          <input type='text' i ='title_txt' name='title' placeholder='Title'/>
        </div>

        <div>
          <textarea id='content_txt' name='contents' placeholder='Please write here'></textarea>
        </div>
      </div>
    );
  }
}

export default write;