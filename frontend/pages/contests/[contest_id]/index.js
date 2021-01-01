import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import withPrivateRoute from '../../../components/utils/withPrivateRoute'
import baseUrl from '../../../shared/baseUrl'
import Loading from '../../../components/common/Loading'
import Error from '../../../components/common/Error'
import ContestRegistration from '../../../components/contests/contestRegistration'
import ContestQuestions from '../../../components/contests/contestQuestions'
import { useRouter } from 'next/router'

const ViewContest = (props) => {
  const router = useRouter()
  const { contest_id: contestIdFromURL } = router.query
  const { user } = props
  const { access_token: accessToken } = user
  const [contestDetails, setContestDetails] = useState()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [contestId, setContestId] = useState(0)
  const [questionsLoading, setQuestionsLoading] = useState(false)
  const [questions, setQuestions] = useState([])
  const [questionsError, setQuestionsError] = useState('')

  useEffect(() => {
    setIsLoading(true)
    setContestId(Number(contestIdFromURL))
    const reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    const requestOptions = {
      method: 'GET',
      headers: reqHeaders
    }
    fetch(`${baseUrl}/contests/${contestIdFromURL}`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success, error, results } = res
        if (success) {
          setError('')
          const startDate = new Date(Date.parse(results.start_time))
          const endDate = new Date(Date.parse(results.end_time))
          const serverDate = new Date(Date.parse(results.server_time))
          setContestDetails({
            ...results,
            clientTime: new Date(),
            start_time: startDate,
            end_time: endDate,
            server_time: serverDate
          })
        } else {
          setError(error.sqlMessage || error)
        }
        setIsLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setIsLoading(false)
        setContestDetails({})
      })
  }, [])

  useEffect(() => {
    if ((contestDetails && contestDetails.registered === 0) || questions.length) {
      return
    }
    setQuestionsLoading(true)
    const reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    const requestOptions = {
      method: 'GET',
      headers: reqHeaders
    }
    fetch(`${baseUrl}/contests/${contestIdFromURL}/questions`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success, error, results } = res
        if (success) {
          setQuestionsError('')
          setQuestions(results)
        } else {
          setQuestionsError(error.sqlMessage || error)
        }
        setQuestionsLoading(false)
      })
      .catch((error) => {
        setQuestionsError(error.message)
        setQuestionsLoading(false)
        setQuestions([])
      })
  }, [contestDetails])

  if (isLoading) {
    return <Loading/>
  } else if (error) {
    return <Error message={error}></Error>
  } else {
    if (!contestDetails) {
      return <Loading/>
    }
    const { start_time: startTime, end_time: endTime, server_time: serverTime, registered, confidential_questions: confidentialQuestions } = contestDetails
    if (endTime < serverTime) {
      if (confidentialQuestions) {
        return <Error message={'The questions for this contest are confidential'} />
      } else {
        return <ContestQuestions
        status='past'
        contestDetails={contestDetails}
        contestId={contestId}
        accessToken={accessToken}
        loading={questionsLoading}
        error={questionsError}
        questions={questions}
      />
      }
    } else if (startTime <= serverTime && endTime >= serverTime) {
      if (registered) {
        return <ContestQuestions
        status='active'
        contestDetails={contestDetails}
        contestId={contestId}
        accessToken={accessToken}
        loading={questionsLoading}
        error={questionsError}
        questions={questions}
      />
      } else {
        return <ContestRegistration
        status='active'
        contestDetails={contestDetails}
        contestId={contestId}
        setContestDetails={setContestDetails}
        accessToken={accessToken}
      />
      }
    } else if (startTime > serverTime) {
      return <ContestRegistration
        status='upcoming'
        contestDetails={contestDetails}
        contestId={contestId}
        setContestDetails={setContestDetails}
        accessToken={accessToken}
      />
    } else {
      return null
    }
  }
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
