
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
    if(category_name) {
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
  }

  _removeCategory = async category => {
    if(window.confirm(`Would you like to delete ${category.name} category?`)) {
      const remove = await axios('/delete/category', {
        method: 'POST',
        data: category,
        headers: new Headers()
      })

      if(remove) {
        alert('Category has been deleted.');
        this._getCategoryData();
      }
    }
  }

  _modifyCategory = async category => {
    let modify_name = document.getElementsByName(`modify_${category.id}`)[0].value;
    modify_name = modify_name.trim();

    if(modify_name !== '' && modify_name.length > 0) {
      if(category.name === modify_name) {
        return alert('The category name already exists. ');
      } else if (window.confirm(`Would you like to replace into the name ${modify_name} instead of ${category.name} ?`)) {
        const _data = {id: category.id, name: modify_name};
        const modify = await axios('/modify/category', {
          method: 'POST',
          data: _data,
          headers: new Headers()
        })

        alert(modify.data.msg);
        this._getCategoryData();
      }  
    } else {
      return alert('Please write at least 1 letter!');
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
                    <img src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjQgMy43NTJsLTQuNDIzLTMuNzUyLTcuNzcxIDkuMDM5LTcuNjQ3LTkuMDA4LTQuMTU5IDQuMjc4YzIuMjg1IDIuODg1IDUuMjg0IDUuOTAzIDguMzYyIDguNzA4bC04LjE2NSA5LjQ0NyAxLjM0MyAxLjQ4N2MxLjk3OC0xLjMzNSA1Ljk4MS00LjM3MyAxMC4yMDUtNy45NTggNC4zMDQgMy42NyA4LjMwNiA2LjY2MyAxMC4yMjkgOC4wMDZsMS40NDktMS4yNzgtOC4yNTQtOS43MjRjMy4yODctMi45NzMgNi41ODQtNi4zNTQgOC44MzEtOS4yNDV6Ii8+PC9zdmc+' className='remove_icon' onClick={() => this._removeCategory(el) }/>
                    <input type='text' maxLength='20' className='edit_input' name={`modify_${el.id}`} defaultValue={el.name}/>
                    <img src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjIuNDYyIDE0Ljk4OGMtMS4xMzYtMS4xMzQtMi42NjEtMS42NDUtNC4xNDYtMS41MjktLjc4NC4wNTktMS41NTktLjIyNi0yLjExNS0uNzgybC00Ljg3Ny00Ljg3OGMtLjU1Ny0uNTU3LS44NDEtMS4zMzEtLjc4Mi0yLjExNS4xMTUtMS40ODUtLjM5Ni0zLjAwOS0xLjUyOS00LjE0Ni0xLjAzMS0xLjAyOS0yLjM3Ny0xLjUzOC0zLjcyNC0xLjUzOC0uNTA3IDAtMS4wMTUuMDcyLTEuNTA1LjIxNmwzLjE3IDMuMTdjLjM0NCAxLjU4OS0xLjk1OSAzLjkxOC0zLjU2NyAzLjU2N2wtMy4xNjktMy4xN2MtLjE0NS40OTItLjIxOCAxLS4yMTggMS41MDkgMCAxLjM0Ny41MSAyLjY5MSAxLjUzOCAzLjcyMSAxLjEzNSAxLjEzNiAyLjY2IDEuNjQ2IDQuMTQ2IDEuNTMuNzgzLS4wNiAxLjU1Ny4yMjYgMi4xMTMuNzgzbDQuODc4IDQuODc4Yy41NTcuNTU3Ljg0MiAxLjMzLjc4MyAyLjExMy0uMTE2IDEuNDg2LjM5NCAzLjAxMiAxLjUzIDQuMTQ2IDEuMDMgMS4wMjcgMi4zNzMgMS41MzcgMy43MjEgMS41MzcuNTA4IDAgMS4wMTYtLjA3MyAxLjUwOC0uMjE3bC0zLjE3LTMuMTY5Yy0uMzUyLTEuNjA4IDEuOTc4LTMuOTExIDMuNTY2LTMuNTY3bDMuMTcxIDMuMTdjLjE0NC0uNDkxLjIxNi0uOTk5LjIxNi0xLjUwNiAwLTEuMzQ3LS41MDktMi42OTMtMS41MzgtMy43MjN6Ii8+PC9zdmc+' className='modify_icon' onClick={() => this._modifyCategory(el)}></img>
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