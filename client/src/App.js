import React from 'react'
import './App.css'

import vacuumLogo from './assets/vacuum-logo-light.svg'
import author from './assets/author.png'
import author2 from './assets/author2.png'

function App() {
  return (
    <div className="container">
      <div className="leftPanel">
        <img className="logo" src={vacuumLogo} alt="VacuumLabs logo" />
        <strong className="leftPanelTitle">Select tag</strong>
        <ul>
          <li>All (656)</li>
          <li>Košice (123)</li>
          <li>Bratislava (100)</li>
          <li>HR (84)</li>
        </ul>
        <a className="showAll" href=".">Show all</a>
      </div>
      <div className="content">
        <div className="topPanel">
          <div className="icon">KE</div>
          <h2>Košice</h2>
        </div>
        <div className="messages">
          <div className="message">
            <div className="authorPicture">
              <img src={author} alt="author" />
            </div>
            <div className="messageData">
              <div className="messageInfo">
                <div className="authorName">Amy Rogers</div>
                <div className="messageDateTimeChannel">August 5th, 1:54 PM in #hq-reports</div>
                <div className="messagePermalink">
                  <a href=".">Go to message on Slack</a>
                </div>
              </div>
              <div className="messageTitle">
                <div className="icon">KE</div>
                <div className="messageTitleText">Corpo structure</div>
              </div>
              <div className="messageContent">Kogi Cosby sweater ethical squid irony disrupt, organic tote bag gluten-free XOXO wolf typewritter mixtape small batch. DIY pickled four loko
                McSweeney's, Odd Future dreamcatcher paid. PBR&B single-origin coffee gluten-free McSweeney's banjo, bicycle rights food truck gastropub vinyl.
              </div>
              <div className="replies">
                <img src={author2} alt="author" />
                <div className="replyCount">1 reply</div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  )
}

export default App
