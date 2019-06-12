import React, { Component } from 'react'
import config from '../../config'
import { Link } from '../ui'
import './UserLink.scss'

class UserLink extends Component {

  render() {
    const {user} = this.props
    const { workspaceName } = config.slack

    return (
      <span className="UserLink">
        <Link to={`https://${workspaceName}.slack.com/team/${user.id}`}>@{user.display_name}</Link>
      </span>
    )
  }
}

export default UserLink
