import React from 'react'
import './Navbar.css'
import navlogo  from '../../assets/nav-logo.svg'
import navfrofile from '../../assets/nav-profile.svg'
const Navbar = () => {
  return (
    <div className='navbar'> 
      <img src={navlogo} alt="" className='nav-logo' />
      <img src={navfrofile} alt="" className='nav-frofile' />
    </div>
  )
}

export default Navbar
