import React, { useState } from 'react'
import { Row, Col, InputGroup, FormControl } from 'react-bootstrap'
import PropTypes from 'prop-types'
import baseUrl from '../../../shared/baseUrl'
import MiniLoader from '../../common/MiniLoader'

function ContestDetail (props) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [contestNameLoading, setContestNameLoading] = useState(false)
  const
    {
      contestId,
      contestName,
      creator,
      setContestName,
      user,
      isModerator
    } = props
  const { access_token: accessToken, username } = user
  const [newContestName, setNewContestName] = useState(contestName)
  const changeContestName = () => {
    if (newContestName.length < 4) {
      return alert('Enter a valid contest name, with at least 4 characters')
    }
    setContestNameLoading(true)
    const reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    reqHeaders.append('Content-Type', 'application/json')
    const requestOptions = {
      method: 'POST',
      headers: reqHeaders,
      body: JSON.stringify({
        new_contest_name: newContestName
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

  if (!isModerator) {
    return <div className='container mt-2'>
      <h2 style={{ display: 'inline' }}>
        {contestName}
        {true ? <sup style={{ fontSize: '18px' }}>&nbsp;<i title="Confidential" className="fa fa-lock"/></sup> : ''}
        &nbsp;
      </h2>
      <hr />
      <br />
    </div>
  }

  return <div className='container mt-2'>
    {isEditOpen
      ? (
      <Row>
        <Col md={5}>
          <InputGroup>
            <FormControl
              type='text'
              name='contestName'
              id='contestName'
              placeholder={contestName}
              defaultValue={contestName}
              style={{ display: 'inline' }}
              onChange={e => setNewContestName(e.target.value)}
            />
          &nbsp;
            <br />
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
          </InputGroup>
        </Col>
      </Row>
        )
      : (
      <>
        <h2 style={{ display: 'inline' }}>
          {contestName}
          {true ? <sup style={{ fontSize: '18px' }}>&nbsp;<i title="Confidential" className="fa fa-lock"/></sup> : ''}
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
        {
          creator === username &&
          <h4
            style={{ display: 'inline', cursor: 'pointer' }}
            role='button'
            onClick={() => {
              console.log('Delete')
            }}>
            <i title="Delete contest" className="fa fa-trash"></i>
          </h4>
        }
      </>
        )}
    <hr />
    <br />
    <br />
    <br />
  </div>
}

ContestDetail.propTypes = {
  contestId: PropTypes.number.isRequired,
  contestName: PropTypes.string,
  creator: PropTypes.string,
  setContestName: PropTypes.func.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string,
    access_token: PropTypes.string,
    isAdmin: PropTypes.number
  }),
  isModerator: PropTypes.bool
}

export default ContestDetail
