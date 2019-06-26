import React, { Component } from 'react'
import parse from '../../parseSlack'
import { Emoji, Link } from '../ui'
import { getChannelLink } from '../../utils/slackRoutes'
import UserLink from './UserLink'
import './MessageContent.scss'

function Style({formatting, children}) {
  const flags = [['*', 'b'], ['_', 'i'], ['~', 'strike']]

  let result = <React.Fragment>{children}</React.Fragment>
  
  for (const [flag, Component] of flags) {
    if (formatting[flag]) result = <Component>{result}</Component>
  }

  return result
}

class MessageContent extends Component {
  lastElementKey = 0

  renderNodes = (nodes) => {
    const {customEmojis, users} = this.props

    const rich = !this.props.solid
    const r = this.renderNodes

    const elem = {
      section({quote, children}, key) {
        const Section = quote ? 'blockquote' : React.Fragment
        return <Section key={key}>{r(children)}</Section>
      },
      line({children}, k) {
        const Line = rich ? 'p' : React.Fragment
        return <Line key={k}>{r(children)}</Line>
      },
      pre: ({text}, k) => rich ? <pre key={k}>{text}</pre> : text,
      vspace: (node, k) => rich ? <span className="vspace" key={k}></span> : '',
      code: ({text}, k) => rich ? <code key={k}>{text}</code> : text,
      emoji: ({id}, k) => <Emoji name={id} customEmojis={customEmojis} key={k}/>,
      user: ({id}, k) => rich ? <UserLink user={users[id]} key={k}/> : users[id].display_name,
      channel: ({id, name}, k) => rich ? <Link to={getChannelLink(id)} key={k}>#{name}</Link> : name,
      url: ({id, name}, k) => rich ? <Link to={id} key={k}>{name}</Link> : name,
      span: ({children, style}, k) => <Style key={k} formatting={style}>{r(children)}</Style>,
    }

    return nodes.map((node, key) =>
      typeof node === 'string' ? node : elem[node.type](node, key.toString())
    )
  }

  render() {
    const nodes = parse(this.props.text)

    return (
      <div className='MessageContent'>{this.renderNodes(nodes)}</div>
    )
  }
}

export default MessageContent
