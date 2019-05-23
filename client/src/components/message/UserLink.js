import React, { Component } from 'react'
import config from '../../config'
import { apiCall } from '../../utils/slackApi'
import { Link } from '../ui'
import './UserLink.scss'

class UserLink extends Component {
  constructor() {
    super()
    this.state = {
      userName: '',
    }
  }

  async componentDidMount() {
    const { user } = this.props
    const profileData = await apiCall('users.profile.get', { user })
    const userName = profileData.ok ? profileData.profile.real_name : ''
    this.setState({ userName })
  }

  render() {
    const { userName } = this.state
    const { user } = this.props
    const { workspaceName } = config.slack

    return (
      <span className="UserLink">
        <Link to={`https://${workspaceName}.slack.com/team/${user}`}>@{userName}</Link>
      </span>
    )
  }
}

export default UserLink
