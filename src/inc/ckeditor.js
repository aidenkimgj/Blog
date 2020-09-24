import React, { Component } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


class ckeditor extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {_getContents, contents} = this.props; 

    return(
      <div className='CKEditor'>
        <CKEditor 
          editor={ClassicEditor} 
          data={contents}
          onBlur={(event, editor) => {
            const data = editor.getData();
            _getContents(data);
          }}
          onFocus={(event, editor) => {
            console.log('Focus', editor);
          }}
        />
      </div>
      
    );
  }
}

export default ckeditor;