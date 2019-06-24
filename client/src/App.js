import React, {Component} from 'react'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'

import {getTags} from './utils/serverApi'
import LeftPanel from './components/leftPanel/LeftPanel'
import Content from './components/content/Content'
import {Loader} from './components/ui'
import './App.scss'

class App extends Component {
  state = {}

  async componentDidMount() {
    const tags = await getTags()
    this.setState({tags})
  }

  render() {
    const {tags} = this.state
    const loading = tags === undefined

    return (
      <div className="container">
        {loading && <Loader light />}
        {!loading && tags.length === 0 && <div className="info">No tags found.</div>}
        {!loading && tags.length > 0 && <BrowserRouter>
          <LeftPanel tags={tags} />
          <Switch>
            <Redirect exact from='/' to={`/${encodeURI(tags[0].tag)}`} />
            <Route exact path='/:tag' component={(props) => {
              const tag = decodeURI(props.match.params.tag)
              return tags.some((t) => t.tag === tag)
                ? (<Content key={tag} tag={tag} />)
                : (<div className="info">Unknown tag.</div>)
            }} />
          </Switch>
        </BrowserRouter>}
      </div>
    )
  }
}

export default App
