import React, { Component } from 'react'
import {Link as RouterLink, withRouter} from 'react-router-dom'

import {parseTs} from '../../utils/helpers'
import archivedIcon from '../../assets/archive.svg'
import asanaIcon from '../../assets/asana.svg'
import editIcon from '../../assets/edit.svg'
import {StateIcon} from '../ui/StateIcon'
import {Tooltip} from '../ui/Tooltip'
import './Tag.scss'

class Tag extends Component {
  render() {
    const {
      tag,
      count,
      lastTs,
      isArchived,
      isLate,
      state,
      portfolios,
      asanaLink
    } = this.props.tag
    const {detailedView, users, reports, onOpenTagEdit} = this.props
    return (
      <li className="listItem">
        {/* Include Tooltip to be able to use data-tip on spans */}
        <Tooltip />
        <RouterLink className={`tagLink${isLate?' late':''}`} to={`/${encodeURI(tag)}${this.props.location.search}`}>
          <div className="basicInfo">
            <span className="tagTitle">
              {tag} ({count})
              {isArchived && <img className="archived" src={archivedIcon} alt="archived" />}
            </span>
            <span className="lastTs">{parseTs(lastTs).fromNow()}</span>
          </div>
          {detailedView && <div className="detailInfo">
            <div className="stateIcon">
              <StateIcon state={state} showTooltip />
            </div>
            <Owners tag={tag} users={users} reports={reports} />
            <Portfolios portfolios={portfolios || []} />
          </div>}
        </RouterLink>
        {detailedView && <AsanaLink asanaLink={asanaLink} />}
        <EditLink
          tag={tag}
          onOpenTagEdit={onOpenTagEdit}
        />
      </li>
    )
  }
}

const Owners = ({tag, users, reports}) => {
  // get counts of messages for each user
  const usersMessagesCount = reports[tag].reduce(
    (acc, report) => ({
      ...acc,
      [report.user]: (acc[report.user] || 0) + 1
    }), {})
  // sort and extract user ids into an array
  const userIdsSorted = 
    Object.entries(usersMessagesCount).sort(
      (([,a],[,b]) => b - a)
    ).map(([userId,]) => userId)

  return <div className="owners">
    {userIdsSorted.map((userId) => 
      <div className="owner" key={userId} >
        <span data-tip={users[userId].real_name}>
          <img src={users[userId].image_32} srcSet={`${users[userId].image_72} 2x`} alt="User Avatar" />
        </span>
      </div>
    )}
  </div>
}

const Portfolios = ({portfolios}) => {
  return (<div className="portfolios">
    {portfolios.sort().map((portfolio) => (
      <div key={portfolio} className="portfolioChip">{portfolio}</div>
    ))}
  </div>)
}

const AsanaLink = ({asanaLink}) => {
  return (<div className="asanaLink">
    {asanaLink ? (
      <a href={asanaLink} target="_blank" rel="noopener noreferrer">
        <span data-tip={'Click to open Asana'}>
          <img src={asanaIcon} alt="asana" />
        </span>
      </a>) : (
      <span data-tip={'Asana link unavailable'}>
        <img src={asanaIcon} className="noLink" alt="Asana not available" />
      </span>
    )}
  </div>)
}

const EditLink = ({tag, onOpenTagEdit}) => {
  return (<div className="edit" onClick={onOpenTagEdit}>
    <span data-tip={`Edit ${tag}`}><img src={editIcon} alt="edit" /></span>
  </div>)
}

export default withRouter(Tag)
