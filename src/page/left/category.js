
import React, { Component } from 'react';
import '../main.css';
import axios from 'axios';
import {Link} from 'react-router-dom';

class category extends Component {
  constructor(props) {
    super(props)
    this.state = {
      category: [],
      edit: false,
    }
  }

  componentDidMount() {
    this._getCategoryData();
  }

  _getCategoryData =  async () => {
    const getData = await axios('/get/category');
    console.log(getData);
    this.setState({category: getData.data});
  } 

  _addCategory = async () => {
    let category_name = window.prompt('Please enter a name for the category you want to add.');
    category_name = category_name.trim();

    if(category_name !== '' && category_name.length > 0) {
      const add = await axios('/add/category', {
        method: 'POST',
        data: {name: category_name},
        headers: new Headers()
      })

      alert(add.data.msg);
      this._getCategoryData();
      
    } else {
      return alert('You must enter at least 1 letter.')
    }
  }

  render() {
    const {category, edit} = this.state;
    const {_changeCategory, login} = this.props;
        let pre_cat = '';

    if(sessionStorage.getItem('category')) {
      pre_cat = Number(sessionStorage.getItem('category'));
    }

    return (
      <div className='Category'>
        <ul>
          <li><Link className={pre_cat === '' ? 'pre_cat' : null} to='/' onClick={() =>_changeCategory('')}>View All</Link>
          {login ? !edit ? <input type='button' value='Edit' className='Edit' onClick={() => this.setState({edit: !edit})}/> : 
                            <input type='button' value='Add' className='Edit' onClick={() => this._addCategory()}/> : null}<hr/></li>
          {category.length > 0 ? 
            category.map( (el, key) => {
              if(!edit) {
                return(
                  <li key={key}><Link className={pre_cat === el.id ? 'pre_cat' : null} to='/' onClick={() => _changeCategory(el.id)}>{el.name}</Link></li>
                  )
              } else {
                return(
                  <li key={key}>
                    <img src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjQgMy43NTJsLTQuNDIzLTMuNzUyLTcuNzcxIDkuMDM5LTcuNjQ3LTkuMDA4LTQuMTU5IDQuMjc4YzIuMjg1IDIuODg1IDUuMjg0IDUuOTAzIDguMzYyIDguNzA4bC04LjE2NSA5LjQ0NyAxLjM0MyAxLjQ4N2MxLjk3OC0xLjMzNSA1Ljk4MS00LjM3MyAxMC4yMDUtNy45NTggNC4zMDQgMy42NyA4LjMwNiA2LjY2MyAxMC4yMjkgOC4wMDZsMS40NDktMS4yNzgtOC4yNTQtOS43MjRjMy4yODctMi45NzMgNi41ODQtNi4zNTQgOC44MzEtOS4yNDV6Ii8+PC9zdmc+' className='remove_icon'/>
                    <input type='text' maxLength='20' className='edit_input' defaultValue={el.name}/>
                  </li>
                )
              }
              
            })
        : null }
        </ul>
      </div>
  );
}
}

export default category;