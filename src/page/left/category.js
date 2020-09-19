
import React, { Component } from 'react';
import '../main.css';
import axios from 'axios';
import {Link} from 'react-router-dom';

class category extends Component {
  constructor(props) {
    super(props)
    this.state = {
      category: [],
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

  render() {
    const {category} = this.state;
    const {_changeCategory} = this.props;
    let pre_cat = '';

    if(sessionStorage.getItem('category')) {
      pre_cat = Number(sessionStorage.getItem('category'));
    }

    return (
      <div className='Category'>
        <ul>
          <li><Link className={pre_cat === '' ? 'pre_cat' : null} to='/' onClick={() =>_changeCategory('')}>View All</Link> <hr /></li>
          {category.length > 0 ? 
            category.map( (el, key) => {
              return(
              <li key={key}><Link className={pre_cat === el.id ? 'pre_cat' : null} to='/' onClick={() => _changeCategory(el.id)}>{el.name}</Link></li>
              )
            })
        : null }
        </ul>
      </div>
  );
}
}

export default category;