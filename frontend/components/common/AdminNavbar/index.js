import React from 'react'
import PropTypes from 'prop-types'
import AdminNavbarDesktop from './DesktopView'
import AdminNavbarMobile from './MobileView'

function AdminNavbar (props) {
  const { isLoggedIn, user, activeNav } = props
  if (!isLoggedIn || !user || !user.isAdmin) { return '' }
  if (window.innerWidth >= 992) {
    return (
      <AdminNavbarDesktop activeNav={activeNav}/>
    )
  } else { return <AdminNavbarMobile/> }
}

AdminNavbar.propTypes = {
  isLoggedIn: PropTypes.bool,
  user: PropTypes.shape({
    isAdmin: PropTypes.number
  }),
  activeNav: PropTypes.string.isRequired
}

export default AdminNavbar
