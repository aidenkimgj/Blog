import React, { Component } from "react";
import "./App.css";
import { Head } from './inc';
import { Main } from './page';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
  
    }
  }

  render() {
    return(
      <div className='App'>
        <div>
          <Head />
        </div>

        <div>
          <Main />
        </div>
      </div>

    )
  }
}

export default App;
