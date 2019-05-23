import React from 'react'
import ReactLoader from 'react-loader-spinner'
import './Loader.scss'

function Loader({ light, size }) {
  return (
    <div className='Loader'>
      <ReactLoader 
        type="Oval"
        color={ light ? '#FFFFFF' : '#00BFFF' }
        height={ size || 100 }
        width={ size || 100 }
      />
    </div>
  )
}

export default Loader
