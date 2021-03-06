import React, { Component } from 'react';
// import './main.css';
import { Route, Link, Switch } from 'react-router-dom';
import { Write, List, View } from './index';
import { Right_Write } from './right';
import { Category } from './left';
import axios from 'axios';

class main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      category: "",
      contents: "",
      title: "",
      board_id: "",
    }
  }

  _withProps = (Component, props) => {
    return (matchProps) => {
      return <Component {...props} {...matchProps} />
    }
  }

  _getContents = val => {
    const _contents = val.trim();

    this.setState({contents: _contents});
  }

  _getTitles = () => {
    const _title = document.getElementsByName('title')[0].value.trim();

    this.setState({title: _title});
  }

  _getModifyData = async board_id => {
    const getData = await axios('/get/board_data', {
      method: 'POST',
      data: {id: board_id},
      headers: new Headers()
    });
    console.log(getData)
    this.setState({title: getData.data.data[0].title,
                  contents: getData.data.data[0].contents,
                  board_id: getData.data.data[0].board_id});
  }

  render() {
    const {login, admin, user_ip, user_id, ip, edit,  list_data, list_all_page, list_search, list_page,  _toggleModal, _changePage, _changeCategory, _changeEdit} = this.props;
    const {_getContents, _getTitles, _getModifyData} = this;
    const {contents, title, board_id} = this.state;

    

    return (
      <div className='Mains'>
        
        <div id='Mains-left'>
          <Route path='/' render={props => <Category 
                                _changeCategory={_changeCategory} 
                                _changeEdit={_changeEdit} 
                                login={login} 
                                admin={admin} 
                                user_ip={user_ip} 
                                ip={ip} 
                                edit={edit}/>} exact/>
        </div>

        <div>
          
          <Route path='/' 
                component={this._withProps(List, {
                  category: this.state.category,
                  list_data: list_data,
                  list_all_page: list_all_page,
                  list_search: list_search,
                  list_page: list_page,
                  _changePage: _changePage})} exact /> 
          
          
            <Route path='/write' component={this._withProps(Write, {
                                _getTitles: _getTitles, 
                                _getContents: _getContents, 
                                title: title, 
                                contents: contents})}/>
            <Route path='/write/modify/:data' 
                    component={this._withProps(Write, { 
                      _getContents : _getContents,
                      _getTitles : _getTitles,
                      contents : contents,
                      title : title,
                      board_id: board_id,
                      _getModifyData : _getModifyData
                      })} exact/>                    
        

          <Route path='/view/:data' 
                  component={this._withProps(View, {
                    admin: admin,
                    login: login,
                    user_id: user_id,
                    _toggleModal: _toggleModal,
          })} />
        </div>

        <div id='Mains-right'>  
          <Route path='/write' component={this._withProps(Right_Write, {title: title, contents: contents})} exact/>
          
          <Route path='/write/modify/:data' component={this._withProps(Right_Write, {title: title, contents: contents})} />
        </div>
        
      </div>
    );
  }
}

export default main;