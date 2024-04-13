import React from 'react'
import "./Header.css"
import Navbar from './Navbar'

function Header() {
  return (
    <div className='HeaderDiv'>
        <div className='HeaderNav'>
            <Navbar/>
        </div>
        <div className='HeaderTitle'>
            <h1>Parking Space Management System</h1>
        </div>
    </div>
  )
}

export default Header