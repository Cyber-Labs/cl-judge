import React, { useState } from 'react'
import {
  Button
} from 'react-bootstrap'
import Link from 'next/link'

function AdminNavbarMobile (props) {
  const [showMenu, setShowMenu] = useState(false)
  const toggleMenu = () => setShowMenu(!showMenu)
  return (
    <>
      <div id="mobileNavbar" className="overlay" style={{ width: showMenu ? '100%' : '0%' }}>
        <div className="overlay-content">
          <h4 style={{ color: 'white' }}> Manage </h4>
          <br/>
          <Link href="/manage/contests" passHref>
            <a className="mobile-nav-link">&nbsp;Contests&nbsp;</a>
          </Link>
          <Link href="/manage/questions" passHref>
            <a className="mobile-nav-link">&nbsp;Questions&nbsp;</a>
          </Link>
          <Link href="/manage/articles" passHref>
            <a className="mobile-nav-link">&nbsp;Articles&nbsp;</a>
          </Link>
          <Link href="/manage/groups" passHref>
            <a className="mobile-nav-link">&nbsp;Groups&nbsp;</a>
          </Link>
          <Link href="/manage/notifications" passHref>
            <a className="mobile-nav-link">&nbsp;Notifications&nbsp;</a>
          </Link>
        </div>
      </div>
      <style jsx> {`
  .overlay {
  height: 100%;
  position: fixed; 
  z-index: 80; 
  left: 0;
  top: 0;
  background-color: rgb(0,0,0); 
  background-color: rgba(0,0,0, 0.9); 
  overflow-x: hidden; 
  transition: 0.5s; 
}

.overlay-content {
  position: relative;
  top: 25%; 
  width: 100%;
  text-align: center; 
  margin-top: 30px; 
}

.mobile-nav-link {
  padding: 8px;
  text-decoration: none;
  font-size: 22px;
  color: #818181;
  display: block; 
  transition: 0.3s; 
}

.mobile-nav-link:hover, .mobile-nav-link:focus {
  color: #f1f1f1;
}

@media screen and (max-height: 450px) {
  .mobile-nav-link {font-size: 20px}
}`}
      </style>
      <Button
        style={{ bottom: '2rem', position: 'fixed', right: '1rem', zIndex: 100, backgroundColor: '#263754' }}
        onClick={toggleMenu}
      >
        <span className={showMenu ? 'fa fa-times' : 'fa fa-bars'}/>
      </Button>
    </>
  )
}

export default AdminNavbarMobile
