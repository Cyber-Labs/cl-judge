import React from 'react'
import PropTypes from 'prop-types'
import AdminNavbar from '../../../components/common/AdminNavbar/index'
import CreateContestForm from '../../../components/manage/contests/createContestForm'
import withAdminRoute from '../../../components/utils/withAdminRoute'

function CreateContest (props) {
  const { isLoggedIn, user } = props
  return (
    <div>
      <AdminNavbar
        user={user}
        isLoggedIn={isLoggedIn}
        activeNav="contests"
      />
      <CreateContestForm user={user} />
    </div>
  )
}

CreateContest.propTypes = {
  isLoggedIn: PropTypes.bool,
  user: PropTypes.shape({
    username: PropTypes.string,
    access_token: PropTypes.string,
    isAdmin: PropTypes.number
  })
}

export default withAdminRoute(CreateContest)
