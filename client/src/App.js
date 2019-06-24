import React, { Component } from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import LeftPanel from './components/leftPanel/LeftPanel'
import Content from './components/content/Content'
import './App.scss'

class App extends Component {
  render() {
    return (
      <div className="container">
        <BrowserRouter>
          <LeftPanel />
          <Switch>
            <Route exact path="/:tag" component={Content} />
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}

export default App
