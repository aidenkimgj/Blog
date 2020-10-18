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
      pre_view: [],
      next_view: [],
    }
  }
  
  componentDidMount = () => {
    
    const board_id = this.props.match.params.data;
    const {pre_view, next_view} = this.state;
    
      this._getLikeInfo();
      if(pre_view.length === 0 || next_view.length === 0) {
        
        this._getPreAndNextData(board_id);
      }
      this._getData(board_id);
        
      this._addViewCnt(board_id);
      
    
  }
  
  _getPreAndNextData = async board_id => {
    const category = sessionStorage.getItem('category');

    const res = await axios('/get/pre_and_next', {
      method: 'POST',
      data: {board_id: board_id, category: category},
      headers: new Headers()
    });
    console.log(res)
    this.setState({pre_view: res.data.pre, next_view: res.data.next});
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
    
    this.setState({data: getData.data, date: _date, like_num: getData.data.data[0].likes});
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

  _changeViewPage = url => {
    if(url === 'null_pre') {
      return alert('This article is the first');
    } else if(url === 'null_next') {
      return alert('This article is the last');
    } 
    return window.location.href = url;
  }

  render() {
    const category = sessionStorage.getItem('category_name');
    const {data, date, none_like, like, like_exist, like_num, pre, next, pre_view, next_view} = this.state;
    const {admin} = this.props;
    
    let next_url = "";
    let pre_url = "";

    if(next_view.length) {
      next_url = `/view/${next_view[0].board_id}`; 
    }

    if(pre_view.length) {
      pre_url = `/view/${pre_view[0].board_id}`;
    }

    return (
        <div className='Write'>
            {data.data ? 
            <div>
              {admin === 'Y' ? 
              <div className='write_option_div'>
                <input type='button' value='Modify'/>
                <input type='button' id='del' value='Delete'/>
              </div> : null}
              
              <div className='top_title'>
                <input type='text' id='title_txt' name='title' defaultValue={data.data[0].title} readOnly />

                <div className='date_div'>
                  {date}
                </div>  
              </div>
              
              <div id='contents_div' dangerouslySetInnerHTML={{__html: data.data[0].contents}}></div> 
              
              <div className='other_div'>
                <input type='button' value='List' id='view_list_button' onClick={() => window.location.href = '/'}/>

                <div className='view_pre_next_div view_pre'>
                  {pre_view.length > 0 ? <img src={pre} title='previous article' onClick={pre_url ? () => this._changeViewPage(pre_url) : () => this._changeViewPage('null_pre') }/> : null}
                  
                  <div>
                    {pre_view.length > 0 ? <p><b>{pre_view[0].title}</b></p> : <b><p>This article is the first in {category}</p></b>}
                  </div>

                </div>
                
                <div className='Like'>
                  <img src={!like_exist ? none_like : like} onClick={() => this._toggleLike()}/>
                  { like_num < 2 ? 
                  <h5> {like_num} Like </h5> : 
                  <h5> {like_num} Likes </h5> }
                </div>
                
                <div className='view_pre_next_div view_next'>
                  {next_view.length > 0 ?<img src={next} title='next article' onClick={next_url ? () => this._changeViewPage(next_url) : () => this._changeViewPage('null_next') }/> : null}
                  
                  <div>
                    {next_view.length > 0 ? <p><b>{next_view[0].title}</b></p> : <b><p>This article is the last in {category}</p></b>}
                  </div>

                </div>

              </div>
            </div>: null}
        </div>
    );
  }
}

export default view;