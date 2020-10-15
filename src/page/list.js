import React, { Component } from 'react';
import './main.css';
import { Search } from './index';
import { Link } from 'react-router-dom';

class list extends Component {

  render() {
    
    const {list_data, list_all_page, list_search, list_page, _changePage} = this.props;
    
    
    return(
      <div className='List'>
        
        <div className='list_grid list_tit'>
          <div>Title</div>
          <div className='view'>Hits</div>
          <div className='acenter'>Date</div>
        </div>
        
        {list_data && list_data.length > 0 ? list_data.map((el, key) => {
          
          const view_url = `/view/${el.board_id}`; 

          return(
            <div className='list_grid list_data' key={key}>
                <div> <Link className='list_link' to={view_url}>{el.title}</Link></div>
                <div className='view'>{el.view_cnt}</div>
                                        
                <div className='acenter'>{el.date.slice(0, 10)}</div>
            </div>

          );
        }) : <div className='not_data acenter'>
              {list_search !== "" ? <div>There are no results to be shown</div> : <div>No data found</div>}
            </div>}

        <div className='paging_div'>
          <div></div>
          <div>
            <ul>
              {list_all_page ? list_all_page.map((el,key) => {
                
                return(
                  
                  el === list_page ? <li key={key} className='page_num'><b>{el}</b></li>
                              : <li key={key} className='page_num' onClick={() => _changePage(el)}>{el}</li> 
                );
              }) : null} 
            </ul>
            <Search search={list_search}/>
          </div>
          <div></div>          

        </div>

      </div>
    );
  }
}

export default list;