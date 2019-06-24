import React, { Component } from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import { getTags } from './utils/serverApi'
import LeftPanel from './components/leftPanel/LeftPanel'
import Content from './components/content/Content'
import './App.scss'

class App extends Component {
  state = {
    loading: true,
    tags: [],
  }

  async componentWillMount() {
    const tags = await getTags()

    this.setState({
      loading: false,
      tags,
    })
  }

  render() {
    const { loading, tags } = this.state
    const firstTag = tags.length ? tags[0].tag : undefined

    return (
      <div className="container">
        <BrowserRouter>
          <LeftPanel loading={loading} tags={tags} />
          <Switch>
            <Route exact path="/:tag" component={Content} />
            <Route render={(props) => <Content {...props} defaultTag={firstTag} loading={loading} />} />
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}

export default App
