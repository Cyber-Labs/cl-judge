import React from 'react'
import PropTypes from 'prop-types'
import AdminNavbar from '../../../components/common/AdminNavbar/index'
import CreateGroupForm from '../../../components/manage/groups/createGroupForm'
import withAdminRoute from '../../../components/utils/withAdminRoute'

function CreateGroup (props) {
  const { isLoggedIn, user } = props
  return (
    <div>
      <AdminNavbar
        user={user}
        isLoggedIn={isLoggedIn}
        activeNav="groups"
      />
      <CreateGroupForm user={user} />
    </div>
  )
}

CreateGroup.propTypes = {
  isLoggedIn: PropTypes.bool,
  user: PropTypes.shape({
    username: PropTypes.string,
    access_token: PropTypes.string,
    isAdmin: PropTypes.number
  })
}

export default withAdminRoute(CreateGroup)
