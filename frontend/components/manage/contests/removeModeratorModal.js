import React, { useState, useEffect } from 'react'
import { Modal, Button, Row, Col, Alert } from 'react-bootstrap'
import PropTypes from 'prop-types'
import Link from 'next/link'
import baseUrl from '../../../shared/baseUrl'
import MiniLoader from '../../common/MiniLoader'
import Toast from '../../common/Toast'

function RemoveModeratorModal (props) {
  const {
    showModal,
    toggleModal,
    selectedUser,
    moderators,
    setModerators,
    accessToken,
    contestId
  } = props

  if (!selectedUser) { return <div/> }

  const { full_name: fullName, username, profile_img: profileImg } = selectedUser
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastLevel, setToastLevel] = useState('')
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    if (showToast) {
      setTimeout(() => {
        setShowToast(false)
      }, 1500)
    }
  }, [showToast])

  const removeModerator = (username) => {
    setIsLoading(true)
    setError('')
    const reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    reqHeaders.append('Content-Type', 'application/json')
    const body = {
      moderator: username
    }
    const requestOptions = {
      method: 'DELETE',
      headers: reqHeaders,
      body: JSON.stringify(body)
    }
    fetch(`${baseUrl}/contests/${contestId}/moderator`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success, error } = res
        if (success) {
          const newModerators = moderators.filter((m) => m.username !== username)
          setModerators(newModerators)
          toggleModal()
          setToastLevel('success')
          setToastMessage(`'${username}' is no longer a contest moderator`)
          setShowToast(true)
        } else {
          setError(error.sqlMessage || error)
        }
        setIsLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setIsLoading(false)
      })
  }

  return <div>
  <Modal show={showModal} onHide={toggleModal}>
    <Modal.Body>
      <h5>Are you sure you want to remove the following user from contest moderators ?
      </h5>
      <div className="container">
        <Row>
          <Col>
            <img
              src={profileImg || '/images/profile.png'}
              id={username}
              style={{
                width: '150px',
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
                paddingBottom: '10px',
                paddingRight: '10px'
              }}
              alt={username}
            />
            <h6>Name : {fullName}</h6>
            <h6>Username : <Link href={`/profile/${username}`}>{username}</Link> </h6>
          </Col>
        </Row>
      </div>
      {error && <Alert variant='danger'>{error}</Alert>}
    </Modal.Body>
    <Modal.Footer>
      <Button variant='warning' onClick={toggleModal}>
      Cancel
      </Button>
      <Button variant='danger' onClick={() => {
        removeModerator(username)
      }}>
      Yes, remove from moderators
      {isLoading && <MiniLoader />}
      </Button>
    </Modal.Footer>
  </Modal>
  <Toast
      level={toastLevel}
      message={toastMessage}
      visible={showToast}
    />
  </div>
}

RemoveModeratorModal.propTypes = {
  selectedUser: PropTypes.shape({
    username: PropTypes.string,
    full_name: PropTypes.string,
    profile_img: PropTypes.string
  }),
  toggleModal: PropTypes.func.isRequired,
  showModal: PropTypes.bool,
  contestId: PropTypes.number.isRequired,
  accessToken: PropTypes.string,
  moderators: PropTypes.arrayOf(PropTypes.shape({
    username: PropTypes.string
  })),
  setModerators: PropTypes.func.isRequired
}

export default RemoveModeratorModal
