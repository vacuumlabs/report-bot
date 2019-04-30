import React from 'react'
import './App.css'
import LeftPanel from './components/leftPanel/LeftPanel'
import TopPanel from './components/topPanel/TopPanel'
import MessageList from './components/message/MessageList'

function App() {
  return (
    <div className="container">
      <LeftPanel />
      <div className="content">
        <TopPanel iconText="KE" title="Košice" />
        <MessageList />
      </div>  
    </div>
  )
}

export default App
