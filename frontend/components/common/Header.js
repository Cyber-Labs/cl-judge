import React, { useEffect, useState } from 'react'
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
import timeSince from '../../utils/timeSince'

function Header (props) {
  const {
    isLoggedIn,
    setIsLoggedIn,
    user,
    setUser,
    topNotifications,
    setTopNotifications
  } = props
  const [unread, setUnread] = useState(false)

  useEffect(() => {
    const unreadNotifications = topNotifications.some(
      (notification) => !notification.read
    )
    setUnread(unreadNotifications)
  }, [topNotifications])

  const router = useRouter()
  const { pathname } = router
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
      <Navbar
        collapseOnSelect
        expand="lg"
        variant="dark"
        style={{ backgroundColor: '#0d1829' }}
      >
        <Navbar.Brand className="mr-auto brand" href="/">
          <img src="/images/logo.png" height="25" alt="" />
          &nbsp; CL Judge
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          {isLoggedIn && (
            <>
              <Nav className="mr-auto">
                <Link href="/contests" passHref>
                  <Nav.Link active={pathname === '/contests'} >&nbsp;Contests&nbsp;</Nav.Link>
                </Link>
                <Link href="/practice" passHref>
                  <Nav.Link active={pathname === '/practice'} >&nbsp;Practice&nbsp;</Nav.Link>
                </Link>
                <Link href="/leaderboard" passHref>
                  <Nav.Link active={pathname === '/leaderboard'} >&nbsp;Leaderboard&nbsp;</Nav.Link>
                </Link>
                <Link href="/community" passHref>
                  <Nav.Link active={pathname === '/community'} >&nbsp;Community&nbsp;</Nav.Link>
                </Link>
                <Link href="https://cp.cyberlabs.club/docs/roadmap/" passHref>
                  <Nav.Link target="_blank">&nbsp;Roadmap&nbsp;</Nav.Link>
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
                      <i
                        className={`fa fa-bell fa-md ml-2 ${
                          unread ? 'text-warning' : ''
                        }`}
                      />
                    </span>
                  }
                  id="notification-dropdown"
                  alignRight
                  onClick={() => {
                    let newTopNotifications = [...topNotifications]
                    newTopNotifications = newTopNotifications.map(
                      (notification) => {
                        notification.read = true
                        return notification
                      }
                    )
                    setTopNotifications(newTopNotifications)
                  }}
                >
                  {topNotifications.map(
                    ({ id, heading, read, created_at: createdAt }) => {
                      const createdDate = new Date(createdAt)
                      return (
                        <NavDropdown.Item
                          key={id.toString()}
                          onClick={() => {
                            router.push('/notifications')
                          }}
                        >
                          <Link href="/notifications">
                            <p>
                              <b>{heading}</b>
                              <br />
                              {timeSince(createdDate)} ago
                            </p>
                          </Link>
                        </NavDropdown.Item>
                      )
                    }
                  )}
                  {!topNotifications.length && (
                    <p align="center"> No new notifications yet </p>
                  )}
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
                  <NavDropdown.Item
                    onClick={() => {
                      if (user) {
                        router.push(`/profile/${user.username}`)
                      }
                    }}
                  >
                    <Link
                      href={user ? `/profile/${user.username}` : '/'}
                      passHref
                    >
                      <a className="dropdown-link">Profile</a>
                    </Link>
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => {
                      router.push('/manage/groups')
                    }}
                  >
                    <Link href="/manage/groups" passHref>
                      <a className="dropdown-link">Manage</a>
                    </Link>
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => {
                      router.push('/groups')
                    }}
                  >
                    <Link href="/groups" passHref>
                      <a className="dropdown-link">My Groups</a>
                    </Link>
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => {
                      router.push('/user/edit-profile')
                    }}
                  >
                    <Link href="/user/edit-profile" passHref>
                      <a className="dropdown-link">Edit Profile</a>
                    </Link>
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    active={false}
                    onClick={() => {
                      router.push('/user/change-password')
                    }}
                  >
                    <Link href="/user/change-password" passHref>
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
    access_token: PropTypes.string,
    isAdmin: PropTypes.number
  }),
  setUser: PropTypes.func.isRequired,
  topNotifications: PropTypes.arrayOf(
    PropTypes.shape({
      heading: PropTypes.string,
      description: PropTypes.string,
      created_at: PropTypes.string
    })
  ),
  setTopNotifications: PropTypes.func.isRequired
}

export default Header
