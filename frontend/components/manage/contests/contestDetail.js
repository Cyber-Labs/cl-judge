import React, { useState } from 'react'
import { Form, Row, Col, Alert, Button, Table } from 'react-bootstrap'
import PropTypes from 'prop-types'
import DateFnsUtils from '@date-io/date-fns'
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import Link from 'next/link'
import ContestNameEdit from './contestNameEdit'
import ContestNavPills from './contestNavPills'
import baseUrl from '../../../shared/baseUrl'
import MiniLoader from '../../common/MiniLoader'
import Loading from '../../common/Loading'
import AddGroupModal from './addGroupModal'
import RemoveGroupModal from './removeGroupModal'
function ContestDetail (props) {
  const
    {
      contestId,
      contestName,
      setContestName,
      user,
      contestDetails
    } = props
  if (!contestDetails) {
    return <Loading/>
  }
  const {
    start_time: defaultStartTime,
    end_time: defaultEndTime,
    show_leaderboard: defaultShowLeaderboard,
    public: defaultPublicContest,
    confidential_questions: defaultConfidentialQuestions,
    about: defaultAbout,
    prizes: defaultPrizes,
    rules: defaultRules,
    eligible_groups: defaultEligibleGroups
  } = contestDetails
  const [confidentialQuestions, setConfidentialQuestions] = useState(defaultConfidentialQuestions)
  const [showLeaderboard, setShowLeaderboard] = useState(defaultShowLeaderboard)
  const [publicContest, setPublicContest] = useState(defaultPublicContest)
  const [startTime, setStartTime] = useState(new Date(defaultStartTime))
  const [endTime, setEndTime] = useState(new Date(defaultEndTime))
  const [isStartTimeValid, setIsStartTimeValid] = useState(true)
  const [isEndTimeValid, setIsEndTimeValid] = useState(true)
  const [about, setAbout] = useState(defaultAbout)
  const [prizes, setPrizes] = useState(defaultPrizes)
  const [rules, setRules] = useState(defaultRules)
  const [message, setMessage] = useState('')
  const [isUpdateLoading, setIsUpdateLoading] = useState(false)
  const [error, setError] = useState('')
  const [eligibleGroups, setEligibleGroups] = useState(defaultEligibleGroups)
  const [isAddGroupModalOpen, setAddGroupModalOpen] = useState(false)
  const [isRemoveGroupModalOpen, setRemoveGroupModalOpen] = useState(false)
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0)

  const { access_token: accessToken } = user

  const updateContest = () => {
    if (!isStartTimeValid || !isEndTimeValid) { return }
    setIsUpdateLoading(true)
    setMessage('')
    setError('')
    const newStartTime = startTime.toISOString()
    const newEndTime = endTime.toISOString()
    const newContestDetails = {}
    Object.assign(newContestDetails,
      newStartTime !== defaultStartTime && { start_time: newStartTime },
      newEndTime !== defaultEndTime && { end_time: newEndTime },
      about !== defaultAbout && about && { about },
      prizes !== defaultPrizes && prizes && { prizes },
      rules !== defaultRules && rules && { rules },
      publicContest !== defaultPublicContest && { public: publicContest },
      confidentialQuestions !== defaultConfidentialQuestions && { confidential_questions: confidentialQuestions },
      showLeaderboard !== defaultShowLeaderboard && { show_leaderboard: showLeaderboard }
    )
    if (!Object.keys(newContestDetails).length) {
      setMessage('Contest updated successfully')
      return setIsUpdateLoading(false)
    }
    const reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    reqHeaders.append('Content-Type', 'application/json')
    const requestOptions = {
      method: 'POST',
      headers: reqHeaders,
      body: JSON.stringify(newContestDetails)
    }
    fetch(`${baseUrl}/contests/${contestId}/update`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success, error, results } = res
        if (success) {
          setMessage(results)
        } else {
          setError(error.sqlMessage || error)
        }
        setIsUpdateLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setIsUpdateLoading(false)
      })
  }

  return <div className='container mt-2'>
    <ContestNameEdit
      contestId={contestId}
      contestName={contestName}
      accessToken={accessToken}
      setContestName={setContestName}
    />
    <ContestNavPills contestId={contestId} activeTab='Basic Info' />
    <Form onSubmit={(e) => {
      e.preventDefault()
      updateContest()
    }}>
      <Row>
          <Col lg={2}/>
          <Col lg={4} className="mt-3">
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker
              label="Start Time"
              inputVariant="outlined"
              value={startTime}
              onChange={setStartTime}
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
      {!publicContest && <Form.Group>
        <Form.Row>
          <Form.Label column lg={2}>
            Eligible Groups :
          </Form.Label>
          <Col>
          {eligibleGroups.length
            ? <Table striped bordered hover responsive="md">
            <thead>
              <tr>
                <th>#</th>
                <th>Group Name</th>
                <th>Number of members</th>
                <th>Make ineligible</th>
              </tr>
            </thead>
            <tbody>
              {eligibleGroups.map(({ group_id: groupId, group_name: groupName, member_count: memberCount }, i) => <tr key={groupId}>
                <td>{i + 1}</td>
                <td>
                  <Link href={`/groups/${groupId}`} style={{ color: 'black' }}>
                  {groupName}
                  </Link>
                </td>
                <td>
                  {memberCount}
                </td>
                <td>
                  <Button
                    variant='danger'
                    onClick={() => {
                      setSelectedGroupIndex(i)
                      setRemoveGroupModalOpen(true)
                    }}>
                    <i className="fa fa-times"/> Remove
                  </Button>
                </td>
              </tr>)}
            </tbody>
          </Table>
            : <div>(No groups eligible)<br/><br/></div>
        }
          <Button onClick={() => {
            setAddGroupModalOpen(true)
          }}>
            <i className="fa fa-plus"/> Add a group
          </Button>
          </Col>
        </Form.Row>
      </Form.Group>
      }
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
              value={about || ''}
              onChange={(e) => setAbout(e.target.value)}
            />
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
              value={rules || ''}
              onChange={(e) => setRules(e.target.value)}
            />
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
              value={prizes || ''}
              onChange={(e) => setPrizes(e.target.value)}
            />
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
      {!isUpdateLoading && error && <Alert variant="danger">{error}</Alert>}
      <div className="text-center">
        <Button variant="success" type="submit" disabled={isUpdateLoading || !isStartTimeValid || !isEndTimeValid}>
          &nbsp;Save&nbsp;
          {isUpdateLoading && <MiniLoader />}
        </Button>
      </div>
      <br />
      {!isUpdateLoading && message && <Alert variant="info">
        {message}
        <br/>
      </Alert>}
    </Form>
    <AddGroupModal
      showModal={isAddGroupModalOpen}
      toggleModal={() => {
        setAddGroupModalOpen(!isAddGroupModalOpen)
      }}
      accessToken={accessToken}
      contestId={contestId}
      alreadySelected={eligibleGroups}
      setAlreadySelected={setEligibleGroups}
    />
    <RemoveGroupModal
      showModal={isRemoveGroupModalOpen}
      toggleModal={() => {
        setRemoveGroupModalOpen(!isRemoveGroupModalOpen)
      }}
      accessToken={accessToken}
      contestId={contestId}
      eligibleGroups={eligibleGroups}
      setEligibleGroups={setEligibleGroups}
      selectedGroup={eligibleGroups[selectedGroupIndex]}
    />
    <br />
  </div>
}

ContestDetail.propTypes = {
  contestId: PropTypes.number.isRequired,
  contestName: PropTypes.string,
  setContestName: PropTypes.func.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string,
    access_token: PropTypes.string,
    isAdmin: PropTypes.number
  }),
  contestDetails: PropTypes.shape({
    show_leaderboard: PropTypes.number,
    public: PropTypes.number,
    confidential_questions: PropTypes.number,
    start_time: PropTypes.string,
    end_time: PropTypes.string,
    about: PropTypes.string,
    rules: PropTypes.string,
    prizes: PropTypes.string,
    eligible_groups: PropTypes.arrayOf(PropTypes.shape({
      group_id: PropTypes.number,
      group_name: PropTypes.string,
      member_count: PropTypes.number
    }))
  })
}

export default ContestDetail
