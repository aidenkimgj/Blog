import React, { Component } from 'react';
import '../main.css';
import axios from 'axios';


class right_write extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category_data: [],
      select_category: "",
    }
  }
  componentDidMount = () => {
    this._getAllCategoryData();
  }

  _getAllCategoryData = async () => {
    const getData = await axios('/get/category');
    console.log(getData.data)
    this.setState({category_data: getData.data});
  }

  _selectCategoryData = () => {
    const category = document.getElementsByName('select_category')[0].value;

    this.setState({select_category: category});
  }

  _submitBoard = async () => {
    const _title = this.props.title;
    const contents = this.props.contents;
    const category = this.state.select_category;

    if(_title === "") {
      return alert('Please enter a title.');
    
    } else if(contents === "") {
      return alert('Please write the content. ');
    
    } else if(category === "") {
      return alert('Please choose the category.')
    }

    const data = {title: _title, contents: contents, category: category};
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
    const {category_data, select_category} = this.state;
    console.log(category_data);
    return(
      <div>
        <div className='select_category_div'>
          <h5>Category Select</h5>
          <select name='select_category' onChange={() => this._selectCategoryData()} value={select_category}>
            <option value=''>-----------------</option>
            {category_data ? category_data.map((el, key) => {
              return(<option value={el.id} key={el.id}>{el.name}</option>)
            }) : null}
          </select>

        </div>

        <div id='post_submit'>
          <button onClick={() => this._submitBoard()}>Post Registration</button>
        </div>
      </div>
    );
  }
}

export default right_write;