import React from 'react'
import {
  Navbar,
  Nav
} from 'react-bootstrap'
import Link from 'next/link'
import PropTypes from 'prop-types'

function AdminNavbarDesktop (props) {
  const { activeNav, isAdmin } = props
  return (
    <div className="align-items-center">
      <Navbar collapseOnSelect expand="lg" variant="dark" id="admin-navbar" style={{ backgroundColor: '#263754', height: '40px' }}>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Link href="/manage/contests" passHref>
              <Nav.Link active={activeNav === 'contests'}>&nbsp;Contests&nbsp;</Nav.Link>
            </Link>
            <Link href="/manage/questions" passHref>
              <Nav.Link active={activeNav === 'questions'}>&nbsp;Questions&nbsp;</Nav.Link>
            </Link>
            <Link href="/manage/articles" passHref>
              <Nav.Link>&nbsp;Articles&nbsp;</Nav.Link>
            </Link>
            <Link href="/manage/groups" passHref>
              <Nav.Link active={activeNav === 'groups'}>&nbsp;Groups&nbsp;</Nav.Link>
            </Link>
            {
              isAdmin && <Link href="/manage/notifications" passHref>
                <Nav.Link active={activeNav === 'notifications'}>&nbsp;Notifications&nbsp;</Nav.Link>
              </Link>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}

AdminNavbarDesktop.propTypes = {
  activeNav: PropTypes.string.isRequired,
  isAdmin: PropTypes.number
}

export default AdminNavbarDesktop
