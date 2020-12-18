import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
import Link from 'next/link'
import AdminNavbar from '../../../components/common/AdminNavbar/index'
import withPrivateRoute from '../../../components/utils/withPrivateRoute'
import baseUrl from '../../../shared/baseUrl'
import Loading from '../../../components/common/Loading'
import Error from '../../../components/common/Error'
import ContestListItem from '../../../components/manage/contests/contestListItem'

function ManageContests (props) {
  const { isLoggedIn, user } = props
  const { access_token: accessToken, isAdmin } = user
  const [contests, setContests] = useState([])
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
    setIsLoading(false)
    setError('')
    setContests([])
    // fetch(`${baseUrl}/contests/moderator_contests`, requestOptions)
    //   .then((res) => res.json())
    //   .then((res) => {
    //     const { success, error, results } = res
    //     if (success) {
    //       setError('')
    //       setContests(results)
    //     } else {
    //       setContests([])
    //       setError(error.sqlMessage || error)
    //     }
    //     setIsLoading(false)
    //   })
    //   .catch((error) => {
    //     setError(error.message)
    //     setIsLoading(false)
    //     setContests([])
    //   })
  }, [])

  return (
    <div>
      <AdminNavbar
        user={user}
        isLoggedIn={isLoggedIn}
        activeNav="contests"
      />
      <div className="container mt-3">
        {
          isAdmin && <div className="text-center">
            <Link href="/manage/contests/create">
              <Button variant="success">
                <i className="fa fa-plus-circle" />
              &nbsp; Create contest
              </Button>
            </Link>
          </div>
        }
        <br />
        {isLoading && <Loading />}
        {!isLoading && error && <Error message={error}></Error>}
        {contests.map(
          ({ id, creator, name, start_time: startTime, end_time: endTime, participants_count: participantCount }) => {
            return (
              <ContestListItem
                key={id.toString()}
                id={id}
                contestName={name}
                participantCount={participantCount}
                creator={creator}
                isModerator
                startTime={startTime}
                endTime={endTime}
              />
            )
          }
        )}
        {
          !isLoading && !error && !contests.length &&
          <div className="text-center">
            <p>You are not a moderator of any contest</p>
          </div>
        }
      </div>
    </div>
  )
}

ManageContests.propTypes = {
  isLoggedIn: PropTypes.bool,
  user: PropTypes.shape({
    username: PropTypes.string,
    access_token: PropTypes.string,
    isAdmin: PropTypes.number
  })
}

export default withPrivateRoute(ManageContests)
