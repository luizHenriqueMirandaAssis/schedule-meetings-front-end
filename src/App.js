import React, { Component } from 'react';
import './App.css';
import Schedule from './components/schedule/Schedule'

class App extends Component {

  getHtml() {
    return (
      <div className="App">
        <header className="App-header">
          <Schedule />
        </header>
      </div>
    );
  }

  render() {
    return this.getHtml();
  }

}


export default App;
