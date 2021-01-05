import React, {Component} from 'react'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import _ from 'lodash'

import {getTags, getReportData, getPortfolios} from './utils/serverApi'
import LeftPanel from './components/leftPanel/LeftPanel'
import Content from './components/content/Content'
import {Loader} from './components/ui'
import './App.scss'

class App extends Component {
  state = {}

  loadReports = async () => {
    const tags = await getTags()
    const reportData = await getReportData()
    this.setState({tags, reportData})
  }

  loadPortfolioOptions = async () => {
    const options = await getPortfolios()
    this.setState({ portfolioOptions: options.map((p) => ({label: p.name, value: p.name})) })
  }

  async componentDidMount() {
    await Promise.all([this.loadReports(), this.loadPortfolioOptions()])
    this.refreshInterval = setInterval(this.loadReports, 5 * 60 * 1000)
  }

  componentWillUnmount() {
    clearInterval(this.refreshInterval)
  }

  render() {
    const {tags, reportData, portfolioOptions} = this.state
    const loading = tags === undefined || portfolioOptions === undefined
    return (
      <div className="container">
        {loading && <Loader light />}
        {!loading && tags.length === 0 && <div className="info">No tags found.</div>}
        {!loading && tags.length > 0 && <BrowserRouter>
          <LeftPanel 
            tags={tags}
            users={reportData.users}
            reports={reportData.reports}
            portfolioOptions={portfolioOptions}
            loadReports={this.loadReports}
            loadPortfolioOptions={this.loadPortfolioOptions}
          />
          <Switch>
            <Redirect exact from='/' to={`/${encodeURI(tags[0].tag)}`} />
            <Route path='/:tag' render={(props) => {
              const tag = decodeURI(props.match.params.tag)
              const {reports, users, channels, emoji} = reportData
              const state = _.find(tags, (t) => t.tag === tag)?.state
              return tags.some((t) => t.tag === tag)
                ? (<Content
                    key={tag}
                    tag={tag}
                    reports={reports[tag]}
                    users={users}
                    channels={channels}
                    emoji={emoji}
                    state={state || ''}
                  />)
                : (<div className="info">Unknown tag.</div>)
            }} />
          </Switch>
        </BrowserRouter>}
      </div>
    )
  }
}

export default App
