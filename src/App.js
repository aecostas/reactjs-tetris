import React from 'react';

import Panel from './components/Panel/panel';

import './App.css';

class App extends React.Component {

  componentDidMount() {


  }

  render() {
    return (
      <div 
        className="App"
        onKeyPress={e => console.log('press key')}
        >
  
        <header className="App-header">
          <Panel />
        </header>
      </div>
    );
  }
}

export default App;
