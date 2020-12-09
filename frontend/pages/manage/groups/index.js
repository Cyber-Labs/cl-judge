import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
import Link from 'next/link'
import AdminNavbar from '../../../components/common/AdminNavbar/index'
import withAdminRoute from '../../../components/utils/withAdminRoute'
import baseUrl from '../../../shared/baseUrl'
import Loading from '../../../components/common/Loading'
import Error from '../../../components/common/Error'
import GroupListItem from '../../../components/manage/groups/groupListItem'

function ManageGroups (props) {
  const { isLoggedIn, user } = props
  const { access_token: accessToken } = user
  const [groups, setGroups] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    var reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    const requestOptions = {
      method: 'GET',
      headers: reqHeaders
    }
    fetch(`${baseUrl}/groups/moderator_groups`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success, error, results } = res
        if (success) {
          setError('')
          setGroups(results)
        } else {
          setGroups([])
          setError(error.sqlMessage || error)
        }
        setIsLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setIsLoading(false)
        setGroups([])
      })
  }, [])

  return (
    <div>
      <AdminNavbar
        user={user}
        isLoggedIn={isLoggedIn}
        activeNav="groups"
      />
      <div className="container mt-3">
        <div className="text-center">
          <Link href="/manage/groups/create">
            <Button variant="success">
              <i className="fa fa-plus-circle" />
              &nbsp; Create a new group
            </Button>
          </Link>
        </div>
        <br />
        {isLoading && <Loading />}
        {!isLoading && error && <Error message={error}></Error>}
        {groups.map(
          ({ id, creator, group_name: groupName, member_count: memberCount, confidential }) => {
            return (
              <GroupListItem
                key={id.toString()}
                id={id}
                groupName={groupName}
                memberCount={memberCount}
                confidential={confidential}
                creator={creator}
              />
            )
          }
        )}
        {
          !isLoading && !error && !groups.length &&
          <div className="text-center">
            <p>You are not a part of any group</p>
          </div>
        }
      </div>
    </div>
  )
}

ManageGroups.propTypes = {
  isLoggedIn: PropTypes.bool,
  user: PropTypes.shape({
    username: PropTypes.string,
    access_token: PropTypes.string,
    isAdmin: PropTypes.number
  })
}

export default withAdminRoute(ManageGroups)
