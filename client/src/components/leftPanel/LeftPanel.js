import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'
import moment from 'moment'

import './LeftPanel.scss'
import vacuumLogo from '../../assets/vacuum-logo-light.svg'
import {parseTs} from '../../utils/helpers'
import Tag from './Tag'
import PortfoliosSelect from './PortfoliosSelect'
import EditPortfolios from './EditPortfolios'
import TagEdit from './TagEdit'



function getPortfoliosFromSearchQuery(searchQuery) {
  if (!searchQuery) return []
  const splitSearchQuery = searchQuery.split('?portfolios=')
  if (splitSearchQuery.length > 0) {
    return splitSearchQuery[1].split(',').map((p) => ({label: p, value: p}))
  }
  return []
} 
class LeftPanel extends Component {

  state = {
    searchString: "",
    portfolios: getPortfoliosFromSearchQuery(this.props.location.search),
    showArchived: false,
    detailedView: true,
    isEditPortfoliosOpen: false,
    tagEditOpen: ''
  }

  onSearchChange = (event) => this.setState({ searchString: event.target.value })
  
  onPortfoliosChange = (portfolios) => {
    this.setState({ portfolios: portfolios || [] })
    const searchQuery = portfolios?.length > 0 ? `?portfolios=${encodeURI(portfolios.map(p => p.value))}` : ''
    this.props.history.push(`${this.props.location.pathname}${searchQuery}`)
  }

  onShowArchivedChange = (event) => this.setState({ showArchived: event.target.checked })

  toggleDetailedView = () => this.setState({ detailedView: !this.state.detailedView })

  render() {
    const {tags, users, reports, portfolioOptions, loadReports, loadPortfolioOptions} = this.props
    const {searchString, portfolios, showArchived, detailedView, isEditPortfoliosOpen, tagEditOpen} = this.state
    for (const tag of tags) {
      tag.isLate =
        !tag.isArchived && moment().diff(parseTs(tag.lastTs), 'days') > tag.frequency
    }
    const partitionedTags = _.flatten(_.partition(tags, 'isLate'))
    const portfoliosValues = portfolios?.length ? portfolios.map((p) => p.value) : []
    const lowerCaseSearchString = searchString.trim().toLowerCase()
    const filteredTags = partitionedTags.filter(
      ({tag, portfolios: tagPortfolios, isArchived}) =>
        tag.toLowerCase().includes(lowerCaseSearchString) &&
        (portfolios?.length === 0 || !_.isEmpty(_.intersection(portfoliosValues, tagPortfolios))) &&
        (searchString || !isArchived || showArchived)
    )
    return (
      <div className={`LeftPanelContainer${searchString ? '' : ' padded'}${detailedView ? ' detailed' : ''}`}>
        {isEditPortfoliosOpen && <EditPortfolios
          onClose={() => this.setState({isEditPortfoliosOpen: false})}
          portfolioOptions={portfolioOptions}
          loadReports={loadReports}
          loadPortfolioOptions={loadPortfolioOptions}
        />}
        <div className="LeftPanel">
          <a href='/' className="logoContainer">
            <img className="logo" src={vacuumLogo} alt="VacuumLabs logo" />
          </a>
          <div className="optionsBar">
            <div className="searchBars">
              <QuickSearch value={searchString} onChange={this.onSearchChange} />
              {detailedView && (
                <PortfoliosSelect
                  options={portfolioOptions}
                  value={portfolios}
                  onChange={this.onPortfoliosChange}
                  placeholder="Filter by portfolios..."
                  showSettings
                  onSettingsClick={() => this.setState({isEditPortfoliosOpen: true})}
                />
              )}
            </div>
            <div onClick={this.toggleDetailedView} className="detailViewButton">
              <i className={`arrow ${detailedView ? 'left' : 'right'}`} />
            </div>
          </div>
          {!searchString && (
	          <ShowArchivedBox
		          label="show archived projects"
		          isChecked={showArchived}
		          onChange={this.onShowArchivedChange}
	          />
          )}
          {filteredTags.map((tag) => (tagEditOpen === tag.tag && <TagEdit
            key={tag.tag}
            tag={tag}
            onClose={() => this.setState({tagEditOpen: ''})}
            isArchived={tag.isArchived}
            asanaLink={tag.asanaLink}
            users={users}
            portfolioOptions={portfolioOptions}
            loadReports={loadReports}
          />))}
          <ul>
            {filteredTags.map((tag) => (<Tag 
              key={tag.tag}
              tag={tag}
              onOpenTagEdit={() => this.setState({tagEditOpen: tag.tag})}
              detailedView={detailedView}
              users={users}
              reports={reports}
            />))}
          </ul>
        </div>
      </div>
    )
  }
}

function QuickSearch({value, onChange}) {
  return (
    <input
      type="text"
      className="input"
      value={value}
      onChange={onChange}
      placeholder="Search tag..."
    />
  )
}

function ShowArchivedBox({label, isChecked, onChange}) {
  return (
    <label className="ShowArchivedBox">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
      />
      {label}
    </label>
  )
}

export default withRouter(LeftPanel)
