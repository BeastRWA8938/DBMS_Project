import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { SidebarData }  from './SidebarData';
import { LuMenu } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import "./Navbar.css";

function Navbar() {
  const [sidebar, setSidebar] = useState(false)

  const showSidebar = () => setSidebar(!sidebar)
  return (
    <div className='navbar-main'>
        <div className='navbar'>
            <Link to="#" className='menu-bars'>
                <h1><LuMenu onClick={showSidebar}/> </h1>
            </Link> 
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className='navbar-toggle'>
              <Link to="#" className='menu-bars'>
                <h1><RxCross2 /></h1>
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    <h1>{item.icon}
                    <span>{item.title}</span></h1>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
    </div>
  )
}

export default Navbar;