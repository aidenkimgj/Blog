import React, { Component } from "react";
import "./App.css";
import axios from 'axios';
import { Head } from './inc';
import { Main } from './page';
import queryString from 'query-string'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      admin: false,
      user_ip: "",
      signup: false,
      ip: "",
      login_modal: false,
      list_data: [],
      list_page: 1,
      list_limit: 10,
      list_all_page: [],
      list_search: "",
      category: "",

    }
  }

  componentDidMount() {
    this._getListData();

    if(sessionStorage.login && sessionStorage.IP) {
      this.setState({login: JSON.parse(sessionStorage.login).id,
                    admin: JSON.parse(sessionStorage.login).admin,
                    user_ip: JSON.parse(sessionStorage.IP)
      });
    }
    this._getIP();
  }
  _getIP = async () => {
    const _ip = await axios('/get/ip');
    
    this.setState({ip: _ip.data});
  }

  _login = (data) => {
    sessionStorage.setItem('login', JSON.stringify(data.suc));
    sessionStorage.setItem('IP', JSON.stringify(data.ip));
    this.setState({login: JSON.parse(sessionStorage.login).id,
                  admin: JSON.stringify(data.suc).admin,
                  user_ip: JSON.parse(sessionStorage.IP)
    });
    
    return window.location.reload();
  }

  _logout = () => {
    this.setState({login: false, admin: false, user_ip: ""});
    sessionStorage.removeItem('login');
    sessionStorage.removeItem('IP');

  }

  _toggleModal = boolean =>{
    this.setState({login_modal: boolean});
  }

  _setPage = () => {
    if(sessionStorage.page) {
      this.setState({list_page: Number(sessionStorage.page)});
      return Number(sessionStorage.page);
    }
    this.setState({list_page: 1});
    return 1;
  }

  _changePage = el => {
    this.setState({list_page: el});
    
    sessionStorage.setItem('page', el);
    return this._getListData();
  }

  _getListData = async () => {
        
    const {list_limit} = this.state;
    const list_pages = this._setPage();
    
    let _category = "";
    
    if(sessionStorage.getItem('category')) {
      _category = sessionStorage.getItem('category');
    }

    let search = "";
    
    if(queryString.parse(this.props.location.search)) {
      search = queryString.parse(this.props.location.search).search;
    }
    
    const total_cnt = await axios('/get/board_cnt', {
      method: 'POST',
      header: new Headers(),
      data: {search: search, category: _category}
    });
    
    const total_list = await axios('/get/board', {
      method: 'POST',
      headers: new Headers(),
      data: {limit: list_limit, 
            page: list_pages, 
            search: search, 
            category: _category}
    });
    console.log(total_list);
    let page_arr = [];
    
    for(let i = 1; i <= Math.ceil(total_cnt.data.cnt / list_limit); i++) {
      page_arr.push(i);
    }
    
    this.setState({list_data: total_list.data, 
                  list_all_page : page_arr, 
                  list_search: search});
    
    sessionStorage.removeItem('page');
  }

  _changeCategory = (target) => {
    this.setState({category: target});
    sessionStorage.setItem('category', target);
    return this._getListData();
  }

  render() {
    const {login, admin, user_ip, ip, login_modal, list_data, list_all_page, list_page, list_search} = this.state;
    const {_login, _logout, _toggleModal, _changePage, _changeCategory} = this;

    return(
      <div className='App'>
        <div>
          <Head login={login} 
                admin={admin} 
                user_ip={user_ip} 
                _login={_login} 
                _logout={_logout} 
                ip={ip} 
                login_modal={login_modal} 
                _toggleModal={_toggleModal} />
        </div>

        <div>
          <Main admin={admin} 
          user_ip={user_ip} 
          login={login} 
          ip={ip}
          list_data={list_data}
          list_all_page = {list_all_page} 
          list_search = {list_search}
          list_page = {list_page}
          _changePage = {_changePage}
          _changeCategory = {_changeCategory} />
        </div>
      </div>

    )
  }
}

export default App;
