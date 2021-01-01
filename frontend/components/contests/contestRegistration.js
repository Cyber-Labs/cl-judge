import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Col } from 'react-bootstrap'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import CustomHeader from '../common/CustomHeader'
import remainingTime from '../../utils/remainingTime'
import baseUrl from '../../shared/baseUrl'
import Toast from '../common/Toast'

function ContestRegistration (props) {
  const router = useRouter()
  const {
    contestDetails,
    contestId,
    status,
    setContestDetails,
    accessToken
  } = props
  const { name, about, rules, prizes, registered, start_time: startTime, end_time: endTime, server_time: serverTime, clientTime } = contestDetails
  let destinationTime
  if (status === 'upcoming') {
    destinationTime = startTime
  } else {
    destinationTime = endTime
  }
  const [timeLeft, setTimeLeft] = useState(remainingTime(destinationTime, serverTime, clientTime))
  const [isLoading, setIsLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastLevel, setToastLevel] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  if (status === 'active' && !timeLeft) {
    router.reload()
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(remainingTime(destinationTime, serverTime, clientTime))
    }, 1000)
    return () => clearTimeout(timer)
  }, [timeLeft])

  useEffect(() => {
    if (showToast) {
      setTimeout(() => {
        setShowToast(false)
      }, 2500)
    }
  }, [showToast])

  const handleRegister = () => {
    setIsLoading(true)
    const reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    const requestOptions = {
      method: 'POST',
      headers: reqHeaders
    }
    fetch(`${baseUrl}/contests/${contestId}/participate`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success, error } = res
        if (success) {
          setContestDetails({ ...contestDetails, registered: 1 })
          setToastLevel('success')
          setToastMessage('Registration successful !')
        } else {
          setToastLevel('danger')
          setToastMessage(error.sqlMessage || error)
        }
        setIsLoading(false)
        setShowToast(true)
      })
      .catch((error) => {
        setToastLevel('danger')
        setToastMessage(error.message)
        setIsLoading(false)
        setShowToast(true)
        setContestDetails({})
      })
  }

  return <div>
      <CustomHeader title={name} backLink="/contests" backTitle="Back"/>
      <div className="container mt-3">
        <div className="contest-title">
          <h2 className="text-center" style={{ fontWeight: 'bold' }}>
            {name}
          </h2>
          <br/>
          <p className="text-center">
            {registered
              ? <Button disabled variant="success"><i className="fa fa-check"/> Already Registered</Button>
              : <Button onClick={handleRegister} disabled={isLoading}><i className="fa fa-user-plus"/> Register</Button>}
          </p>
        </div>
        <Row>
          {status === 'active' && <Col className="text-center text-danger">
            <h4>
            {timeLeft ? `Contest ends in ${timeLeft}` : 'Contest has ended'}
            </h4>
          </Col>}
          {status === 'upcoming' && <Col className="text-center text-primary">
            <h4>
            {timeLeft ? `Contest starts in ${timeLeft}` : 'Contest has started'}
            </h4>
          </Col>}
        </Row>
        <Row>
          <Col>
            <h5 style={{ fontWeight: 'bold' }}>About</h5>
            <ReactMarkdown plugins={[gfm]} source={about} />
          </Col>
        </Row>
        {rules && <Row>
          <Col>
            <h5 style={{ fontWeight: 'bold' }}>Rules</h5>
            <ReactMarkdown plugins={[gfm]} source={rules} />
          </Col>
        </Row>}
        {prizes && <Row>
          <Col>
            <h5 style={{ fontWeight: 'bold' }}>Prizes</h5>
            <ReactMarkdown plugins={[gfm]} source={prizes} />
          </Col>
        </Row>}
    </div>
    <Toast
      level={toastLevel}
      message={toastMessage}
      visible={showToast}
    />
    <style jsx>{`
    .contest-title {
      padding: 34px 20px;
      margin-bottom: 5px;
      background-color: #f5f5f5;
      border-radius: 6px;      
    }
    `}
    </style>
    </div>
}

ContestRegistration.propTypes = {
  contestDetails: PropTypes.shape({
    name: PropTypes.string,
    about: PropTypes.string,
    rules: PropTypes.string,
    prizes: PropTypes.string,
    registered: PropTypes.number,
    start_time: PropTypes.instanceOf(Date),
    end_time: PropTypes.instanceOf(Date),
    server_time: PropTypes.instanceOf(Date),
    clientTime: PropTypes.instanceOf(Date)
  }),
  contestId: PropTypes.number.isRequired,
  status: PropTypes.oneOf(['upcoming', 'active']),
  setContestDetails: PropTypes.func.isRequired,
  accessToken: PropTypes.string.isRequired
}

export default ContestRegistration
