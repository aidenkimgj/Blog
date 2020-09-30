import React, { Component } from 'react';

class back_and_close extends Component {
  constructor(props) {
    super(props);
    this.state = {
      close: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjQgMy43NTJsLTQuNDIzLTMuNzUyLTcuNzcxIDkuMDM5LTcuNjQ3LTkuMDA4LTQuMTU5IDQuMjc4YzIuMjg1IDIuODg1IDUuMjg0IDUuOTAzIDguMzYyIDguNzA4bC04LjE2NSA5LjQ0NyAxLjM0MyAxLjQ4N2MxLjk3OC0xLjMzNSA1Ljk4MS00LjM3MyAxMC4yMDUtNy45NTggNC4zMDQgMy42NyA4LjMwNiA2LjY2MyAxMC4yMjkgOC4wMDZsMS40NDktMS4yNzgtOC4yNTQtOS43MjRjMy4yODctMi45NzMgNi41ODQtNi4zNTQgOC44MzEtOS4yNDV6Ii8+PC9zdmc+",
      back: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTcuMDI2IDIyLjk1N2MxMC45NTctMTEuNDIxLTIuMzI2LTIwLjg2NS0xMC4zODQtMTMuMzA5bDIuNDY0IDIuMzUyaC05LjEwNnYtOC45NDdsMi4yMzIgMi4yMjljMTQuNzk0LTEzLjIwMyAzMS41MSA3LjA1MSAxNC43OTQgMTcuNjc1eiIvPjwvc3ZnPg==",
    }
  }
  render() {
    const {close, back} = this.state;
    const {target, _backSearchModal, _closeSearchModal} = this.props;
    return(
      <div className='back_and_close'>
        <div id='back_icon'><img src={back} onClick={() => {_backSearchModal(target);
        _resetIDResult(); }}/></div>
        <div id='close_icon'><img src={close} onClick={() => _closeSearchModal(target)}/></div>
      </div>
    );
  }
}

export default back_and_close;