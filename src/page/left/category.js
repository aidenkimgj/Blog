
import React, { Component } from 'react';
import '../main.css';
import axios from 'axios';


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


    return (
        <div className='Category'>
          <ul>
            <li><u>View All</u> <hr /></li>
            {category.length > 0 ? 
              category.map( (el, key) => {
                return(
                <li key={key}><u>{el.name}</u></li>
                )
              })
          : null }
          </ul>
        </div>
    );
  }
}

export default category;