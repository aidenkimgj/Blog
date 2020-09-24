import React, { Component } from 'react';
import './main.css';
import axios from 'axios';
import queryString from 'query-string'
import { Search } from './index';
import { Link } from 'react-router-dom';

class list extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      all_page: [],
      page: 1, 
      limit: 10, 
      search: "",
    }
  }

  componentWillMount() {
    
    this._getListData();
    // this._setPage();
  }
  
  _getListData = async () => {
        
    const {limit} = this.state;
    const page = this._setPage();
    
    let {category} = this.props;
    if(sessionStorage.getItem('category')) {
      category = sessionStorage.getItem('category');
    }

    let search = queryString.parse(this.props.location.search);
    console.log(search)
    if(search) {
      search = search.search;
    }
    
    const total_cnt = await axios('/get/board_cnt', {
      method: 'POST',
      header: new Headers(),
      data: {search: search, category: category}
    }
    );
    
    const total_list = await axios('/get/board', {
      method: 'POST',
      headers: new Headers(),
      data: {limit: limit, page: page, search: search, category: category}
    });
    
    let page_arr = [];
    console.log(total_cnt.data.cnt)
    for(let i = 1; i <= Math.ceil(total_cnt.data.cnt / limit); i++) {
      page_arr.push(i);
    }
    
    this.setState({data: total_list.data, all_page: page_arr, search: search});
    
  }

  _changePage = el => {
    this.setState({page: el})
    
    sessionStorage.setItem('page', el)
    return this._getListData();
  }

  _setPage = () => {
    if(sessionStorage.page) {
      this.setState({page: Number(sessionStorage.page)});
      return Number(sessionStorage.page);
    }
    this.setState({page: 1});
    return 1;
  }

  render() {
    
    const list = this.state.data;
    console.log(list)
    const {all_page, page, search} = this.state;
    
    
    return(
      <div className='List'>
        
        <div className='list_grid list_tit'>
          <div>Title</div>
          <div>Hits</div>
          <div className='acenter'>Date</div>
        </div>
        
        {list && list.length > 0 ? list.map((el, key) => {
          
          const view_url = `/view/${el.board_id}`; 

          return(
            <div className='list_grid list_data' key={key}>
                <div> <Link className='list_link' to={view_url}>{el.title}</Link></div>
                <div className='veiw'>{el.view_cnt}</div>
                                        
                <div className='acenter'>{el.date.slice(0, 10)}</div>
              </div>

          );
        }) : <div className='not_data acenter'>
              {search !== "" ? <div>There are no results to be shown</div> : <div>No data found</div>}
            </div>}

        <div className='paging_div'>
          <div></div>
          <div>
            <ul>
              {all_page ? all_page.map((el,key) => {
                
                return(
                  
                  el === page ? <li key={key} className='page_num'><b>{el}</b></li>
                              : <li key={key} className='page_num' onClick={() => this._changePage(el)}>{el}</li> 
                );
              }) : null} 
            </ul>
            <Search search={search}/>
          </div>
          <div></div>          

        </div>

      </div>
    );
  }
}

export default list;