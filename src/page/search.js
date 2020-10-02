import React, { Component } from 'react';
import './main.css';

export default class search extends Component {
  constructor(props) {
    super(props)
  }

  render() {

    const {search} = this.props;
    if(search) {
      document.getElementsByName('search')[0].value = search
    }

    return (
        <div>
            <form>
              <input type='text' maxLength='20' className='search_input' name='search' placeholder='Please enter a keyword'/>
              <input type='submit' value='Search' className='search_submit'/>
            </form>
        </div>
    );
  }
}

