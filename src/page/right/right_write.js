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
    const board_id = this.props.match.params.data;
    
    this._getAllCategoryData();
    
    if(board_id && !this.state.select_category) {
      this._selectCategoryData(board_id);
    }
  }

  _getAllCategoryData = async () => {
    const getData = await axios('/get/category');
    console.log(getData.data)
    this.setState({category_data: getData.data});
  }

  _selectCategoryData = async board_id => {
    let category = document.getElementsByName('select_category')[0].value;

    if(board_id) {
      const getData = await axios('/get/board_data', {
        method: 'POST',
        headers: new Headers(),
        data: {id: board_id}
      });
      console.log(getData);
      return this.setState({select_category: getData.data.data[0].cat_id});
    }
    this.setState({select_category: category});
  }

  _submitBoard = async () => {
    const _title = this.props.title;
    const contents = this.props.contents;
    const category = this.state.select_category;
    const board_id = this.props.match.params.data;

    if(_title === "") {
      return alert('Please enter a title.');
    
    } else if(contents === "") {
      return alert('Please write the content. ');
    
    } else if(category === "") {
      return alert('Please choose the category.')
    }

    if(!board_id) {
      
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

    } else {
      
      const data = {title: _title, constents: contents, category: category, board_id: board_id};

      const res = await axios('/update/board', {
        method: 'POST',
        data: data,
        headers: new Headers()
      }); 

      if(res.data) {
        alert('Your article updated.');

        const url = `/view/${board_id}`;

        sessionStorage.setItem('category', category);
        return window.location.href = url;
      }
    }
    
  }

  render() {
    const {category_data, select_category} = this.state;
    
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
          <button onClick={() => this._submitBoard()}>
            {!this.props.match.params.data ? 'Post' : 'Edit'}  
          </button>
        </div>
      </div>
    );
  }
}

export default right_write;