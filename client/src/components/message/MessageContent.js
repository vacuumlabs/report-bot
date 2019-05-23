import React, { Component } from 'react'
import slackMessageParser, { NodeType } from 'slack-message-parser'
import { Emoji, Link } from '../ui'
import ChannelLink from './ChannelLink'
import Quote from './Quote'
import UserLink from './UserLink'
import './MessageContent.scss'

class MessageContent extends Component {
  lastElementKey = 0

  renderTreeRich = (node) => {
    const { customEmojis } = this.props

    switch (node.type) {
      case NodeType.Bold:
        return <strong key={this.lastElementKey++}>{node.children.map(this.renderTreeRich)}</strong>
      case NodeType.ChannelLink:
        return <ChannelLink key={this.lastElementKey++} channelId={node.channelID} channelName={node.label[0].text} />
      case NodeType.Code:
        return <code key={this.lastElementKey++}>{node.text}</code>
      case NodeType.Emoji:
        return <Emoji key={this.lastElementKey++} name={node.name} customEmojis={customEmojis} />
      case NodeType.Italic:
        return <i key={this.lastElementKey++}>{node.children.map(this.renderTreeRich)}</i>
      case NodeType.Quote:
        return <Quote key={this.lastElementKey++}>{node.children[0].text}</Quote>
      case NodeType.PreText:
        return <pre key={this.lastElementKey++}>{node.text.trim()}</pre>
      case NodeType.Root:
        return <div key={this.lastElementKey++}>{node.children.map(this.renderTreeRich)}</div>
      case NodeType.Strike:
        return <del key={this.lastElementKey++}>{node.children.map(this.renderTreeRich)}</del>
      case NodeType.Text:
        return node.text
      case NodeType.URL:
        return <Link key={this.lastElementKey++} to={node.url}>{node.url}</Link>
      case NodeType.UserLink:
        return <UserLink key={this.lastElementKey++} user={node.userID} />
      case NodeType.Command:
      default:
        return <></>
    }
  }

  renderTreeSolid = (node) => {
    const { customEmojis } = this.props

    switch (node.type) {
      case NodeType.Bold:
        return <strong key={this.lastElementKey++}>{node.children.map(this.renderTreeSolid)}</strong>
      case NodeType.ChannelLink:
        return `#${node.label[0].text}`
      case NodeType.Code:
      case NodeType.Text:
        return node.text
      case NodeType.Emoji:
        return <Emoji key={this.lastElementKey++} name={node.name} customEmojis={customEmojis} />
      case NodeType.Italic:
        return <i key={this.lastElementKey++}>{node.children.map(this.renderTreeSolid)}</i>
      case NodeType.Quote:
        return node.children[0].text
      case NodeType.PreText:
        return node.text.trim()
      case NodeType.Root:
        return <div key={this.lastElementKey++}>{node.children.map(this.renderTreeSolid)}</div>
      case NodeType.Strike:
        return <del key={this.lastElementKey++}>{node.children.map(this.renderTreeSolid)}</del>
      case NodeType.URL:
        return node.url
      case NodeType.UserLink:
        return `@${node.userID}`
      case NodeType.Command:
      default:
        return <></>
    }
  }

  render() {
    const tree = slackMessageParser(this.props.text)

    return (
      <div className='MessageContent'>
        {this.props.solid ? this.renderTreeSolid(tree) : this.renderTreeRich(tree)}
      </div>
    )
  }
}

export default MessageContent
