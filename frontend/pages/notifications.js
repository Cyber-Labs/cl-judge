import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'react-bootstrap'
import NotificationListItem from '../components/manage/notifications/notificationListItem'
import withPrivateRoute from '../components/utils/withPrivateRoute'
import baseUrl from '../shared/baseUrl'
import Loading from '../components/common/Loading'

function Notifications (props) {
  const { user } = props
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
    fetch(`${baseUrl}/notifications/`, requestOptions)
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
    <div className="container mt-4">
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
  )
}

Notifications.propTypes = {
  user: PropTypes.shape({
    access_token: PropTypes.string
  })
}

export default withPrivateRoute(Notifications)
