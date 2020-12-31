import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Col, ListGroup, ListGroupItem, Table } from 'react-bootstrap'
import remainingTime from '../../utils/remainingTime'
import CustomHeader from '../common/CustomHeader'
import Link from 'next/link'
import Loading from '../common/Loading'
import MiniLoader from '../common/MiniLoader'
import Error from '../common/Error'
import baseUrl from '../../shared/baseUrl'

function ContestQuestions (props) {
  const {
    contestDetails,
    contestId,
    accessToken,
    loading,
    error,
    questions
  } = props
  const { name, about, rules, prizes, start_time: startTime, end_time: endTime, server_time: serverTime, clientTime, show_leaderboard: showLeaderboard } = contestDetails
  const destinationTime = endTime
  const [timeLeft, setTimeLeft] = useState(remainingTime(destinationTime, serverTime, clientTime))
  const [leaderboardLoading, setLeaderboardLoading] = useState(false)
  const [leaderboardError, setLeaderboardError] = useState('')
  const [leaderboard, setLeaderboard] = useState([])

  useEffect(() => {
    if (timeLeft === '') {
      return
    }
    const timer = setTimeout(() => {
      setTimeLeft(remainingTime(destinationTime, serverTime, clientTime))
    }, 1000)
    return () => clearTimeout(timer)
  }, [timeLeft])

  useEffect(() => {
    if (!showLeaderboard) {
      return
    }
    setLeaderboardLoading(true)
    const reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    const requestOptions = {
      method: 'GET',
      headers: reqHeaders
    }
    fetch(`${baseUrl}/contests/${contestId}/leaderboard?sort=[{"id":"rank","desc":false}]&size=10&page=0`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success, error, results } = res
        if (success) {
          const { leaderboard: leaderboardData } = results
          setLeaderboard(leaderboardData)
          setLeaderboardError('')
        } else {
          setLeaderboard([])
          setLeaderboardError(error.sqlMessage || error)
        }
        setLeaderboardLoading(false)
      })
      .catch((error) => {
        setLeaderboardError(error.message)
        setLeaderboardLoading(false)
        setLeaderboard([])
      })
  }, [])

  return <div>
      <CustomHeader title={name} backLink="/contests" backTitle="Back"/>
        <Row className="mt-2">
          <Col lg={9}>
            <div className="container" style={{ backgroundColor: '#f5f5f5', minHeight: '80vh' }}>
            <br/>
            <ListGroup>
              {loading && <Loading/>}
              {!loading && error && <Error message={error}/>}
              {!loading && !error && !questions.length && <Error message={'Questions not available'}/>}
              {!loading && !error && questions.map((question) => {
                const { question_id: questionId, name, type, difficulty, max_score: maxScore } = question
                return <ListGroupItem key={questionId.toString()}>
                <Row>
                  <Col md={8} lg={10}>
                    <h4>{name}</h4>
                    <p>
                    {difficulty === 'easy' && <span className='text-success'>Easy, </span>}
                    {difficulty === 'medium' && <span style={{ color: '#db7100' }}>Medium, </span>}
                    {difficulty === 'hard' && <span className='text-danger'>Hard, </span>}
                    <span className="text-secondary">
                    Type :
                    {type === 'mcq' && <span> MCQ</span>}
                    {type === 'subjective' && <span> Subjective</span>}
                    {type === 'coding' && <span> Coding</span>}
                    , Max Score : {maxScore}
                    </span>
                    </p>
                  </Col>
                  <Col md={4} lg={2} className="align-items-center my-auto text-center">
                    <Link href={`/contests/${contestId}/questions/${questionId}`}>
                      <Button variant="outline-success">
                      Solve
                      </Button>
                    </Link>
                  </Col>
                </Row>
                </ListGroupItem>
              })}
            </ListGroup>
            <br/>
            </div>
          </Col>
          <Col lg={3}>
              <div className="container" style={{ backgroundColor: '#f5f5f5' }}>
                <br/>
                <p className="text-danger" style={{ fontWeight: 'bold' }}>
                {timeLeft ? `Contest ends in ${timeLeft}` : 'Contest has ended'}
                </p>
                {new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  day: '2-digit',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true
                }).format(new Date(Date.parse(startTime)))} -
                 &nbsp;{new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  day: '2-digit',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true
                }).format(new Date(Date.parse(endTime)))}
                <hr/>
                <h5 style={{ fontWeight: 'bold' }}>About</h5>
                <p>{about}</p>
                <hr/>
                {rules && <><h5 style={{ fontWeight: 'bold' }}>Rules</h5>
                <p>{rules}</p>
                <hr/>
                </>}
                {prizes && <><h5 style={{ fontWeight: 'bold' }}>Prizes</h5>
                <p>{prizes}</p>
                <hr/>
                </>}
                {showLeaderboard && <>
                <Link href={`/contests/${contestId}/leaderboard`} passHref>
                <h5 style={{ fontWeight: 'bold', cursor: 'pointer', color: 'blue' }}>Leaderboard</h5>
                </Link>
                {leaderboardLoading && <MiniLoader/>}
                {!leaderboardLoading && leaderboardError && <Error message={leaderboardError}/>}
                {!leaderboardLoading && !leaderboardError && <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Username</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map(({ rank, username, total_score: totalScore }) => <tr key={username}>
                      <td>{rank}</td>
                      <td>
                        <Link href={`/profile/${username}`}>
                        {username}
                        </Link>
                      </td>
                      <td>
                        {totalScore}
                      </td>
                    </tr>)}
                  </tbody>
                  </Table>}
                <hr/>
                </>}
              </div>
          </Col>
        </Row>
      </div>
}

ContestQuestions.propTypes = {
  contestDetails: PropTypes.shape({
    name: PropTypes.string,
    about: PropTypes.string,
    rules: PropTypes.string,
    prizes: PropTypes.string,
    start_time: PropTypes.instanceOf(Date),
    end_time: PropTypes.instanceOf(Date),
    server_time: PropTypes.instanceOf(Date),
    clientTime: PropTypes.instanceOf(Date),
    show_leaderboard: PropTypes.number
  }),
  contestId: PropTypes.number.isRequired,
  status: PropTypes.oneOf(['past', 'active']),
  accessToken: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  questions: PropTypes.arrayOf(PropTypes.shape({
    question_id: PropTypes.number,
    name: PropTypes.string,
    difficulty: PropTypes.string,
    type: PropTypes.string,
    max_score: PropTypes.number
  }))
}

export default ContestQuestions
