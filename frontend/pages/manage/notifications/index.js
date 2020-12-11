import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Alert } from 'react-bootstrap'
import Link from 'next/link'
import AdminNavbar from '../../../components/common/AdminNavbar/index'
import withAdminRoute from '../../../components/utils/withAdminRoute'
import baseUrl from '../../../shared/baseUrl'
import Loading from '../../../components/common/Loading'
import NotificationListItem from '../../../components/manage/notifications/notificationListItem'

function ManageNotifications (props) {
  const { isLoggedIn, user } = props
  const { access_token: accessToken } = user
  const [notifications, setNotifications] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    const requestOptions = {
      method: 'GET',
      headers: reqHeaders
    }
    fetch(`${baseUrl}/notifications/creator_notifications`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success, error, results } = res
        if (success) {
          setError('')
          setNotifications(results)
        } else {
          setNotifications([])
          setError(error.sqlMessage || error)
        }
        setIsLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setIsLoading(false)
        setNotifications([])
      })
  }, [])

  return (
    <div>
      <AdminNavbar
        user={user}
        isLoggedIn={isLoggedIn}
        activeNav="notifications"
      />
      <div className="container mt-3">
        <div className="text-center">
          <Link href="/manage/notifications/create">
            <Button variant="success">
              <i className="fa fa-plus-circle" />
              &nbsp; Create a new notification
            </Button>
          </Link>
        </div>
        <br />
        {isLoading && <Loading />}
        {!isLoading && error && <Alert variant="danger">{error}</Alert>}
        {notifications.map(
          ({ id, heading, description, created_at: createdAt }) => {
            const createdDate = new Date(createdAt)
            const options = {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric'
            }
            const formattedDate = new Intl.DateTimeFormat(
              'en-IN',
              options
            ).format(createdDate)
            return (
              <NotificationListItem
                key={id.toString()}
                heading={heading}
                description={description}
                createdAt={formattedDate}
              />
            )
          }
        )}
      </div>
    </div>
  )
}

ManageNotifications.propTypes = {
  isLoggedIn: PropTypes.bool,
  user: PropTypes.shape({
    username: PropTypes.string,
    access_token: PropTypes.string,
    isAdmin: PropTypes.number
  })
}

export default withAdminRoute(ManageNotifications)
