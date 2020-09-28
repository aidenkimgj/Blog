import React, { Component } from 'react';
import './main.css';
import { Route, Link, Switch } from 'react-router-dom';
import { Write, List, View } from './index';
import { Right_Write } from './right';
import { Category } from './left';


class main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      category: "",
      contents: "",
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

  render() {
    const {login, admin, user_ip, ip, list_data, list_all_page, list_search, list_page, _changePage, _changeCategory} = this.props;
    const {_getContents} = this;
    const {contents} = this.state;

    

    return (
      <div className='Mains'>
        
        <div id='Mains-left'>
          <Route path='/' render={props => <Category _changeCategory={_changeCategory} login={login} admin={admin} user_ip={user_ip} ip={ip}/>} exact/>
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
          <Route path='/write' component={this._withProps(Write, {_getContents: _getContents, contents: contents})} />

          
          
          <Route path='/view/:data' component={View} />
        </div>

        <div id='Mains-right'>  
          <Route path='/write' component={this._withProps(Right_Write, {contents: contents})} />
        </div>
        
      </div>
    );
  }
}

export default main;