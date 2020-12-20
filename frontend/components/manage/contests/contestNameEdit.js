import React, { useState } from 'react'
import { Row, Col, InputGroup, FormControl } from 'react-bootstrap'
import PropTypes from 'prop-types'
import baseUrl from '../../../shared/baseUrl'
import MiniLoader from '../../common/MiniLoader'

function ContestNameEdit (props) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [contestNameLoading, setContestNameLoading] = useState(false)
  const
    {
      contestId,
      contestName,
      setContestName,
      accessToken
    } = props
  const [newContestName, setNewContestName] = useState(contestName)
  const [contestNameError, setContestNameError] = useState('')
  const changeContestName = () => {
    if (newContestName.length < 4) {
      return setContestNameError('Enter a valid contest title, with at least 4 characters')
    }
    setContestNameError('')
    setContestNameLoading(true)
    const reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    reqHeaders.append('Content-Type', 'application/json')
    const requestOptions = {
      method: 'POST',
      headers: reqHeaders,
      body: JSON.stringify({
        name: newContestName
      })
    }
    fetch(`${baseUrl}/contests/${contestId}/update`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success } = res
        if (success) {
          setContestName(newContestName)
        } else {
          alert('Couldn\'t modify contest name. Try Again!')
        }
        setContestNameLoading(false)
        setIsEditOpen(false)
      })
      .catch(() => {
        alert('Couldn\'t modify contest name. Try Again!')
        setContestNameLoading(false)
        setIsEditOpen(false)
      })
  }
  return <div>
  {isEditOpen
    ? (
    <Row>
      <Col md={4}>
        <InputGroup>
          <FormControl
            type='text'
            name='contestName'
            id='contestName'
            placeholder={'Enter a contest title'}
            defaultValue={contestName}
            style={{ display: 'inline' }}
            onChange={e => setNewContestName(e.target.value)}
            isInvalid={contestNameError}
          />
          {
            contestNameError && <FormControl.Feedback type='invalid'>
              {contestNameError}
            </FormControl.Feedback>
          }
        </InputGroup>
      </Col>
      <Col md={2} className="mt-2">
          <h6
            onClick={changeContestName}
            style={{
              display: 'inline',
              color: 'blue',
              paddingTop: '20px',
              cursor: 'pointer'
            }}
            onKeyDown={changeContestName}
            role='button'
          >
            <u>Save</u>
            {contestNameLoading ? <MiniLoader/> : ''}
          </h6>
      </Col>
    </Row>
      )
    : (
    <>
      <h2 style={{ display: 'inline' }}>
        {contestName}
      &nbsp;
      </h2>
      <h6
        onClick={() => {
          setIsEditOpen(!isEditOpen)
        }}
        style={{ display: 'inline', color: 'blue', cursor: 'pointer' }}
        onKeyDown={() => {
          setIsEditOpen(!isEditOpen)
        }}
        role='button'
      >
        <u>Edit</u>
      </h6>
      &nbsp;&nbsp;&nbsp;
    </>
      )}
  <hr />
  </div>
}

ContestNameEdit.propTypes = {
  contestId: PropTypes.number.isRequired,
  contestName: PropTypes.string,
  setContestName: PropTypes.func.isRequired,
  accessToken: PropTypes.string
}

export default ContestNameEdit
