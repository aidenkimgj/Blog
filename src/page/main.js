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
      category: '',
    }
  }

  _changeCategory = (target) => {
    this.setState({category: target});
    sessionStorage.setItem('category', target)
  }

  _withProps = (Component, props) => {
    return (matchProps) => {
      return <Component {...props} {...matchProps} />
    }
  }

  render() {

    const {_changeCategory} = this;
    return (
      <div className='Mains'>
        
        <div id='Mains-left'>
        <Route path='/' render={props => <Category _changeCategory={_changeCategory} />} exact/>
        </div>

        <div>
          
          <Route path='/' component={this._withProps(List, {category: this.state.category})} exact /> 
          <Route path='/write' component={Write} />
          
          <Route path='/view/:data' component={View} />
        </div>

        <div id='Mains-right'>  
          <Route path='/write' component={Right_Write} />
        </div>
        
      </div>
    )
  }
}

export default main;