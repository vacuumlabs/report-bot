import React, {Component} from 'react'
import TopPanel from '../topPanel/TopPanel'
import MessageList from '../message/MessageList'
import {Loader} from '../ui'
import {getReportsByTag} from '../../utils/serverApi'
import './Content.scss'

class Content extends Component {
  state = {
    loading: true,
  }

  async componentDidMount() {
    const response = await getReportsByTag(this.props.tag)
    this.setState({...response, loading: false})
  }

  render() {
    const {tag} = this.props
    const {emoji, reports, users, channels, loading} = this.state

    return (
      <div className="Content">
        {loading &&
          <div className="loader">
            <Loader />
          </div>
        }
        {!loading &&
          <>
            <TopPanel selectedTag={tag} customEmojis={emoji} />
            <MessageList reports={reports} users={users} channels={channels} customEmojis={emoji} />
          </>
        }
      </div>
    )
  }
}

export default Content
