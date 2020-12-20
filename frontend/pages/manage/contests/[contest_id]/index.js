import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import AdminNavbar from '../../../../components/common/AdminNavbar/index'
import withPrivateRoute from '../../../../components/utils/withPrivateRoute'
import baseUrl from '../../../../shared/baseUrl'
import Loading from '../../../../components/common/Loading'
import Error from '../../../../components/common/Error'
import ContestDetail from '../../../../components/manage/contests/contestDetail'
import { useRouter } from 'next/router'

const ViewContest = (props) => {
  const router = useRouter()
  const { contest_id: contestIdFromURL } = router.query
  const { isLoggedIn, user } = props
  const { access_token: accessToken } = user
  const [contestDetails, setContestDetails] = useState()
  const [contestName, setContestName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [contestId, setContestId] = useState(0)

  useEffect(() => {
    setIsLoading(true)
    setContestId(Number(contestIdFromURL))
    const reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    const requestOptions = {
      method: 'GET',
      headers: reqHeaders
    }
    fetch(`${baseUrl}/contests/${contestIdFromURL}/details`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success, error, results } = res
        if (success) {
          const { name } = results
          setError('')
          setContestDetails(results)
          setContestName(name)
        } else {
          setError(error.sqlMessage || error)
        }
        setIsLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setIsLoading(false)
        setContestDetails({})
        setContestName('')
      })
  }, [])

  return <div>
    <AdminNavbar
      user={user}
      isLoggedIn={isLoggedIn}
      activeNav="contests"
    />
    {isLoading && <Loading />}
    {!isLoading && error && <Error message={error}></Error>}
    {!isLoading && !error && <ContestDetail
      contestId={contestId}
      contestName={contestName}
      contestDetails={contestDetails}
      setContestName={setContestName}
      user={user}
      isModerator
    />}
  </div>
}

ViewContest.propTypes = {
  isLoggedIn: PropTypes.bool,
  user: PropTypes.shape({
    username: PropTypes.string,
    access_token: PropTypes.string,
    isAdmin: PropTypes.number
  })
}

export default withPrivateRoute(ViewContest)
