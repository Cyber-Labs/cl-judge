import React from 'react'
import PropTypes from 'prop-types'
import AdminNavbar from '../../../components/common/AdminNavbar/index'
import CreateNotificationForm from '../../../components/manage/notifications/createNotificationForm'
import withAdminRoute from '../../../components/utils/withAdminRoute'

function CreateNotification (props) {
  const { isLoggedIn, user } = props
  return (
    <div>
      <AdminNavbar
        user={user}
        isLoggedIn={isLoggedIn}
        activeNav="notifications"
      />
      <CreateNotificationForm user={user} />
    </div>
  )
}

CreateNotification.propTypes = {
  isLoggedIn: PropTypes.bool,
  user: PropTypes.shape({
    username: PropTypes.string,
    access_token: PropTypes.string,
    isAdmin: PropTypes.number
  })
}

export default withAdminRoute(CreateNotification)
