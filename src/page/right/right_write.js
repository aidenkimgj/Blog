import React, { Component } from 'react';
import '../main.css';
import axios from 'axios';


class right_write extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      contents: "",
    }
  }

  _submitBoard = async () => {
    const _title = document.getElementsByName('title')[0].value.trim();
    const _contents = document.getElementsByName('contents')[0].value.trim();

    if(_title === "") {
      return alert('Please enter a title.')
    } else if (_contents === "") {
      return alert('Please enter the content. ')
    }

    const data = {title: _title, contents: _contents};
    const res = await axios('/add/board', {
      method: 'POST',
      data: data,
      headers: new Headers()
    });

    if(res.data) {
      alert('Your article posted.');
      return window.location.replace('/');
    }
  }

  render() {
    return(
      <div>
        <div id='post_submit'>
          <button onClick = {() => this._submitBoard()}>Post Registration</button>
        </div>
      </div>
    );
  }
}

export default right_write;