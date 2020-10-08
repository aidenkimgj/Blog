import React, { Component } from 'react';
import './main.css';
import axios from 'axios';


class view extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      date: "",
      none_like: "https://image.flaticon.com/icons/png/512/25/25297.png",
      like: "https://image.flaticon.com/icons/png/512/25/25423.png",
      like_exist: false,
      like_num: 0
    }
  }

  componentDidMount() {
    const board_id = this.props.match.params.data;
    this._getData(board_id);
    this._addViewCnt(board_id);
    this._getLikeInfo();
  }

  _getData = async board_id => {
    
    console.log(this.props)
    const getData = await axios('/get/board_data', {
      method: 'POST',
      headers: new Headers(),
      data: {id: board_id}
    });
    console.log(getData);
    
    const _date = `${getData.data.data[0].date.slice(0,10)} ${getData.data.data[0].date.slice(11,16)}`;
    
    return this.setState({data: getData.data, date: _date});
  }  

  _addViewCnt = async board_id => {
    const addView = await axios('/update/view_cnt', {
      method: 'POST',
      headers: new Headers(),
      data: {id: board_id}
    });
  }

  _toggleLike = async () => {
    const {user_id, login, _toggleModal} = this.props;

    if(!login) {
      alert('Login needs to be done!');
      return _toggleModal(true);
    }
    const board_id = this.props.match.params.data;
    const obj = {type: 'add', user_id: user_id, board_id: board_id}
    
    const res = await axios('/update/like', {
      method: 'POST',
      data: obj,
      headers: new Headers()
    });

    if(!res.data) {
      return alert('This post has been already liked by you.');
    } else {
      this.setState({like_exist: true});
      return alert(`You have clicked 'the like button' on this post.`);
    }
  }

  _getLikeInfo = async () => {
    const {user_id, login} = this.props;

    if(login) {

      const board_id = this.props.match.params.data;
      const obj = {user_id: user_id, board_id: board_id}

      const getData = await axios('/check/like', {
        method: 'POST',
        data: obj,
        headers: new Headers()
      });
      console.log(getData);
      if(getData.data[0]) {
        this.setState({like_exist: true});
      }
    }
  }

  render() {

    const {data, date, none_like} = this.state;
    return (
        <div className='Write'>
            {data.data ? 
            <div>
              <div className='top_title'>
                <input type='text' id='title_txt' name='title' defaultValue={data.data[0].title} readOnly />

                <div className='date_div'>
                  {date}
                </div>  
              </div>
              
              <div id='contents_div' dangerouslySetInnerHTML={{__html: data.data[0].contents}}></div> 
              
              <div className='other_div'>
                <div>{/*left */}</div>
                <div className='Like'>
                  <img src={none_like} onClick={() => this._toggleLike()}/>
                  <h5>Like</h5>
                </div>
                <div>{/*right*/}</div>

              </div>
            </div>
            : null}
        </div>
    );
  }
}

export default view;