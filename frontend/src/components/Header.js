import React from 'react'

function Header(props) {
  return (
    <div className='bg-dark text-white text-center py-3'>
      <h1>{props.title}</h1>
    </div>
  )
}

export default Header
