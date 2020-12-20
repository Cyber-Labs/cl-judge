import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
import Link from 'next/link'
import AdminNavbar from '../../../components/common/AdminNavbar/index'
import withPrivateRoute from '../../../components/utils/withPrivateRoute'
import baseUrl from '../../../shared/baseUrl'
import Loading from '../../../components/common/Loading'
import Error from '../../../components/common/Error'
import ContestListItem from '../../../components/manage/contests/contestListItem'

const LIMIT = 6
function ManageContests (props) {
  const { isLoggedIn, user } = props
  const { access_token: accessToken, isAdmin } = user
  const [contests, setContests] = useState([])
  const [error, setError] = useState('')
  const [isLoading, _setIsLoading] = useState(false)
  const [cursor, setCursor] = useState(0)
  const [allContestsLoaded, _setAllContestsLoaded] = useState(false)

  const isLoadingRef = useRef(isLoading)
  const allContestsLoadedRef = useRef(allContestsLoaded)

  const setIsLoading = (val) => {
    isLoadingRef.current = val
    _setIsLoading(val)
  }

  const setAllContestsLoaded = (val) => {
    allContestsLoadedRef.current = val
    _setAllContestsLoaded(val)
  }

  const fetchContestsData = () => {
    const reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    const requestOptions = {
      method: 'GET',
      headers: reqHeaders
    }
    fetch(`${baseUrl}/contests/moderator_contests?limit=${LIMIT}&cursor=${cursor}`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success, error, results } = res
        if (success) {
          setError('')
          setContests(contests.concat(results))
          if (!results.length || results.length < LIMIT) {
            setAllContestsLoaded(true)
          } else { setCursor(results[results.length - 1].id) }
        } else {
          setContests([])
          setError(error.sqlMessage || error)
        }
        setIsLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setIsLoading(false)
        setContests([])
      })
  }

  useEffect(() => {
    setError('')
    setContests([])
    setIsLoading(true)
    window.addEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isLoading || allContestsLoaded) return
    fetchMoreListItems()
  }, [isLoading])

  const fetchMoreListItems = () => {
    fetchContestsData()
  }

  const handleScroll = () => {
    if (allContestsLoadedRef.current) { return }
    if (
      Math.ceil(window.innerHeight + document.documentElement.scrollTop) < document.documentElement.offsetHeight - 100 || isLoadingRef.current
    ) { return }
    setIsLoading(true)
  }

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
        {isLoading && <Loading />}
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
