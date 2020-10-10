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
      like_num: 0,
      pre: 'https://image.flaticon.com/icons/png/512/122/122637.png',
      next: 'https://image.flaticon.com/icons/png/512/122/122636.png',
    }
  }

  componentDidMount() {
    const board_id = this.props.match.params.data;
    this._getLikeInfo();
    this._getData(board_id);
    this._addViewCnt(board_id);
  
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
    
    return this.setState({data: getData.data, date: _date, like_num: getData.data.data[0].likes});
  }  

  _addViewCnt = async board_id => {
    const {user_id} = this.props;
    const addView = await axios('/update/view_cnt', {
      method: 'POST',
      headers: new Headers(),
      data: {id: board_id, user_id: user_id}
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
      if(window.confirm('Would you like to cancel Like?')) {
        const cancel = {type: 'remove', user_id: user_id, board_id: board_id}
        
        await axios('/update/like', {
          method: 'POST',
          data: cancel,
          headers: new Headers()
        });

        this.setState({like_exist: false});
        alert('Like has been cancelled');
      }
      
    } else {
      this.setState({like_exist: true});
      
      alert(`You have expressed Like on this post.`);
    }
    return this._getData(board_id);
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

    const {data, date, none_like, like, like_exist, like_num, pre, next} = this.state;
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
                <div className='view_pre_next_div view_pre'>
                  <img src={pre}/>
                </div>
                <div className='Like'>
                  <img src={!like_exist ? none_like : like} onClick={() => this._toggleLike()}/>
                  <h5>Like {like_num}</h5>
                </div>
                <div className='view_pre_next_div view_next'>
                  <img src={next}/>
                </div>

              </div>
            </div>
            : null}
        </div>
    );
  }
}

export default view;