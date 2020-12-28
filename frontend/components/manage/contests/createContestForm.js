import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { Form, Row, Col, Alert, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { Formik } from 'formik'
import * as yup from 'yup'
import DateFnsUtils from '@date-io/date-fns'
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import MiniLoader from '../../common/MiniLoader'
import baseUrl from '../../../shared/baseUrl'
import Link from 'next/link'

const createContestSchema = yup.object({
  contestName: yup
    .string()
    .required('Contest Title is required')
    .min(4, 'Contest Title should have minimum 4 characters'),
  about: yup
    .string(),
  prizes: yup
    .string(),
  rules: yup
    .string()
})

function createContestForm (props) {
  const { user } = props
  const { access_token: accessToken } = user
  const router = useRouter()
  const [confidentialQuestions, setConfidentialQuestions] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [publicContest, setPublicContest] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState('')
  const [startTime, setStartTime] = useState(new Date().setMinutes(new Date().getMinutes() + 5))
  const [endTime, setEndTime] = useState(new Date().setMinutes(new Date().getMinutes() + 10))
  const [isStartTimeValid, setIsStartTimeValid] = useState(true)
  const [isEndTimeValid, setIsEndTimeValid] = useState(true)

  const reqHeaders = new Headers()
  reqHeaders.append('access_token', accessToken)
  reqHeaders.append('Content-Type', 'application/json')

  const createContest = (data) => {
    if (!isStartTimeValid || !isEndTimeValid) { return }
    setIsLoading(true)
    const { contestName, about, prizes, rules } = data
    const contest = {
      name: contestName,
      confidential_questions: confidentialQuestions,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      public: publicContest,
      show_leaderboard: showLeaderboard
    }
    Object.assign(contest, about && { about },
      prizes && { prizes },
      rules && { rules }
    )
    const requestOptions = {
      method: 'POST',
      headers: reqHeaders,
      body: JSON.stringify(contest)
    }
    fetch(`${baseUrl}/contests`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success, error, results } = res
        console.log(success, error, results)
        if (success) {
          const { message, contestId } = results
          setResult(message)
          router.push(`/manage/contests/${contestId}`)
        } else {
          setResult('')
          setError(error.sqlMessage || error)
        }
        setIsLoading(false)
      })
      .catch((error) => {
        setResult('')
        setError(error.message)
        setIsLoading(false)
      })
  }

  return (
    <div className="container mt-3">
      <div className="text-center">
        <h4>Create a new contest</h4>
      </div>
      <br />
      <Formik
        validationSchema={createContestSchema}
        onSubmit={createContest}
        initialValues={{ contestName: '' }}
      >
        {({ handleSubmit, handleChange, values, touched, errors }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group controlId="contestName">
              <Form.Row>
                <Form.Label column lg={2}>
                  Contest Title
                </Form.Label>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Name of contest"
                    name="contestName"
                    value={values.contestName}
                    onChange={handleChange}
                    isValid={touched.contestName && !errors.contestName}
                    isInvalid={!!errors.contestName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.contestName}
                  </Form.Control.Feedback>
                </Col>
              </Form.Row>
            </Form.Group>
            <Row>
                <Col lg={2}>
                </Col>
                <Col lg={4} className="mt-3">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DateTimePicker
                    label="Start Time"
                    inputVariant="outlined"
                    value={startTime}
                    onChange={setStartTime}
                    disablePast
                    strictCompareDates
                    onError={(err) => {
                      if (err) {
                        setIsStartTimeValid(false)
                      } else {
                        setIsStartTimeValid(true)
                      }
                    }}
                  />
                </MuiPickersUtilsProvider>
                </Col>
                <Col lg={4} className="mt-3">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DateTimePicker
                    label="End Time"
                    inputVariant="outlined"
                    value={endTime}
                    onChange={setEndTime}
                    disablePast
                    minDate={startTime}
                    minDateMessage='End time should not be before start time'
                    strictCompareDates
                    onError={(err) => {
                      if (err) {
                        setIsEndTimeValid(false)
                      } else {
                        setIsEndTimeValid(true)
                      }
                    }}
                  />
                </MuiPickersUtilsProvider>
                </Col>
            </Row>
            <br/>
            <Form.Group controlId="about">
              <Form.Row>
                <Form.Label column lg={2}>
                  About Contest
                </Form.Label>
                <Col>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="About the contest"
                    name="about"
                    value={values.about}
                    onChange={handleChange}
                    isValid={touched.about && !errors.about}
                    isInvalid={!!errors.about}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.about}
                  </Form.Control.Feedback>
                </Col>
              </Form.Row>
            </Form.Group>
            <Form.Group controlId="rules">
              <Form.Row>
                <Form.Label column lg={2}>
                  Rules
                </Form.Label>
                <Col>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Rules of contest"
                    name="rules"
                    value={values.rules}
                    onChange={handleChange}
                    isValid={touched.rules && !errors.rules}
                    isInvalid={!!errors.rules}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.rules}
                  </Form.Control.Feedback>
                </Col>
              </Form.Row>
            </Form.Group>
            <Form.Group controlId="prizes">
              <Form.Row>
                <Form.Label column lg={2}>
                  Prizes
                </Form.Label>
                <Col>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Prizes (only, if applicable)"
                    name="prizes"
                    value={values.prizes}
                    onChange={handleChange}
                    isValid={touched.prizes && !errors.prizes}
                    isInvalid={!!errors.prizes}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.prizes}
                  </Form.Control.Feedback>
                </Col>
              </Form.Row>
            </Form.Group>
            <Form.Group as={Row} controlId="confidentialQuestions">
              <Col sm={{ span: 10, offset: 2 }}>
                <Form.Check
                  label="Hide questions after the contest"
                  checked={confidentialQuestions}
                  onChange={(e) => {
                    setConfidentialQuestions(e.target.checked)
                  }}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="publicContest">
              <Col sm={{ span: 10, offset: 2 }}>
                <Form.Check
                  label="Allow everyone to participate (Don't select this option if you want to allow only certain groups to participate in the contest.)"
                  checked={publicContest}
                  onChange={(e) => {
                    setPublicContest(e.target.checked)
                  }}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="showLeaderboard">
              <Col sm={{ span: 10, offset: 2 }}>
                <Form.Check
                  label="Show real-time leaderboard to all the participants during the contest"
                  checked={showLeaderboard}
                  onChange={(e) => {
                    setShowLeaderboard(e.target.checked)
                  }}
                />
              </Col>
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            <div className="text-center">
              <Button type="submit" disabled={isLoading || !isStartTimeValid || !isEndTimeValid}>
                &nbsp;Create Contest&nbsp;
                {isLoading && <MiniLoader />}
              </Button>
            </div>
            <br />
            <br />
            {result && <Alert variant="info">
              {result}
              <br/>
              Manage your contests &nbsp;
              <Link href='/manage/contests'>
              here
              </Link>
            </Alert>}
          </Form>
        )}
      </Formik>
      <br />
    </div>
  )
}

createContestForm.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    access_token: PropTypes.string,
    isAdmin: PropTypes.number
  })
}

export default createContestForm
