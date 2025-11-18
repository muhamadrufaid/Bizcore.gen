import React from 'react'
import Logo from './Logo'

const Header = () => {
  return (
    <div style={{ backgroundColor: 'rgba(0, 7, 85, 1)' }} className='w-60 h-12 flex items-center justify-center'>
      <Logo />
    </div>
  )
}

export default Header
