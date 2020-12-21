import React, { Component } from 'react'
import {Link as RouterLink} from 'react-router-dom'

import {parseTs} from '../../utils/helpers'
import archivedIcon from '../../assets/archive.svg'
import asanaIcon from '../../assets/asana.svg'
import editIcon from '../../assets/edit.svg'
import './Tag.scss'

class Tag extends Component {
  render() {
    const {tag, count, lastTs, isArchived, isLate, state, portfolios, asanaLink} = this.props.tag
    const {detailedView, users, reports} = this.props
    return (
      <li className="listItem">
        <RouterLink className={`tagLink${isLate?' late':''}`} to={`/${encodeURI(tag)}`}>
          <div className="basicInfo">
            <span className="tagTitle">
              {tag} ({count})
              {isArchived && <img className="archived" src={archivedIcon} alt="archived" />}
            </span>
            <span className="lastTs">{parseTs(lastTs).fromNow()}</span>
          </div>
          {detailedView && <div className="detailInfo">
            <StateIcon state={state} />
            <Owners tag={tag} users={users} reports={reports} />
            <Portfolios portfolios={portfolios || []} />
          </div>}
        </RouterLink>
        {detailedView && <AsanaLink asanaLink={asanaLink} />}
        <EditLink tag={tag} />
      </li>
    )
  }
}

const StateIcon = ({state}) => {  
  return <div className="stateContainer">
    <div className="stateIcon">
      <div className="tooltipContainer">
        <div className={`state ${state}`}></div>
        <div className="tooltip">{state}</div>
      </div>
    </div>
  </div>
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
        <div className="tooltipContainer">
          <img src={users[userId].image_32} srcSet={`${users[userId].image_72} 2x`} alt="User Avatar" />
          <div className="tooltip">{users[userId].real_name}</div>
        </div>
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
    <div className="tooltipContainer">
      {asanaLink ? (
        <a href={asanaLink} target="_blank" rel="noopener noreferrer">
          <img src={asanaIcon} alt="asana" />
        </a>) : (
        <img src={asanaIcon} className="noLink" alt="Asana not available" />
      )}
      <div className="tooltip">{asanaLink ? 'Click to open Asana' : 'Asana link unavailable'}</div>
    </div>
  </div>)
}

const EditLink = ({tag}) => {
  return (<div className="edit">
    <RouterLink to={`/${encodeURI(tag)}/edit`}>
      <div className="tooltipContainer">
        <img src={editIcon} alt="edit" />
        <div className="tooltip">Edit {tag}</div>
      </div>
    </RouterLink>
  </div>)
}

export default Tag
