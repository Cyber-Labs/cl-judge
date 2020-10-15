import React from 'react'
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  InputGroup,
  NavDropdown,
  Button
} from 'react-bootstrap'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import CONSTANTS from '../../shared/CONSTANTS'

function Header (props) {
  const { isLoggedIn, setIsLoggedIn, user, setUser } = props
  const router = useRouter()
  const logout = () => {
    if (!isLoggedIn) {
      return
    }
    localStorage.removeItem(CONSTANTS.KEYS.CL_JUDGE_AUTH)
    setIsLoggedIn(false)
    setUser(null)
    router.push('/')
  }
  return (
    <div className="align-items-center">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand className="mr-auto brand" href="/">
          <img src="/images/logo.png" height="30" alt="" />
          &nbsp; CL Judge
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          {isLoggedIn && (
            <>
              <Nav className="mr-auto">
                <Link href="/contests" passHref>
                  <Nav.Link>&nbsp;Contests&nbsp;</Nav.Link>
                </Link>
                <Link href="/practice" passHref>
                  <Nav.Link>&nbsp;Practice&nbsp;</Nav.Link>
                </Link>
                <Link href="/leaderboard" passHref>
                  <Nav.Link>&nbsp;Leaderboard&nbsp;</Nav.Link>
                </Link>
                <Link href="/community" passHref>
                  <Nav.Link>&nbsp;Community&nbsp;</Nav.Link>
                </Link>
              </Nav>
              <Form inline>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text id="search-addon">
                      <span className="fa fa-search" />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    style={{ height: '50%' }}
                    type="text"
                    placeholder="Search"
                    className="mr-sm-2"
                  />
                </InputGroup>
              </Form>
              <Nav>
                <NavDropdown
                  title={
                    <span>
                      <i className="fa fa-bell fa-md ml-2" />
                    </span>
                  }
                  id="notification-dropdown"
                  alignRight
                >
                  <NavDropdown.Item>
                    <p>
                      <b>Welcome to Online Judge</b>
                      <br />2 minutes ago
                    </p>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <Link href="/notifications" passHref>
                      <Button variant="dark" block size="sm">
                        See all
                      </Button>
                    </Link>
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown
                  title={
                    <span>
                      <i className="fa fa-user fa-md ml-2" />{' '}
                    </span>
                  }
                  id="account-dropdown"
                  alignRight
                >
                  <NavDropdown.Item>
                    <Link
                      href={user ? `/profile/${user.username}` : '/'}
                      passHref
                    >
                      <a className="dropdown-link">Profile</a>
                    </Link>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <Link href="/manage" passHref>
                      <a className="dropdown-link">Manage</a>
                    </Link>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <Link href="/account-settings" passHref>
                      <a className="dropdown-link">Account Settings</a>
                    </Link>
                  </NavDropdown.Item>
                  <NavDropdown.Item active={false}>
                    <Link href="/auth/change-password" passHref>
                      <a className="dropdown-link">Change Password</a>
                    </Link>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item active={false} onClick={() => logout()}>
                    <Link href="/">
                      <a className="dropdown-link">Sign out</a>
                    </Link>
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </>
          )}
        </Navbar.Collapse>
      </Navbar>
      <style jsx>{`
        .dropdown-toggle:after {
          content: none !important;
        }
        .dropdown-link {
          color: black;
        }
        .dropdown-link:hover {
          text-decoration: none;
        }
      `}</style>
    </div>
  )
}

Header.propTypes = {
  isLoggedIn: PropTypes.bool,
  setIsLoggedIn: PropTypes.func.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string,
    access_token: PropTypes.string
  }),
  setUser: PropTypes.func.isRequired
}

export default Header
