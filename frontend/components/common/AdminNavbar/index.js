import React from 'react'
import PropTypes from 'prop-types'
import AdminNavbarDesktop from './DesktopView'
import AdminNavbarMobile from './MobileView'

function AdminNavbar (props) {
  const { isLoggedIn, user, activeNav } = props
  if (!isLoggedIn || !user) { return '' }
  if (window.innerWidth >= 992) {
    return (
      <AdminNavbarDesktop activeNav={activeNav} isAdmin={user.isAdmin}/>
    )
  } else { return <AdminNavbarMobile isAdmin={user.isAdmin}/> }
}

AdminNavbar.propTypes = {
  isLoggedIn: PropTypes.bool,
  user: PropTypes.shape({
    isAdmin: PropTypes.number
  }),
  activeNav: PropTypes.string.isRequired
}

export default AdminNavbar
