import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { Modal, Button, Row, Col, Alert } from 'react-bootstrap'
import PropTypes from 'prop-types'
import SearchUsers from '../../common/SearchUsers'
import MiniLoader from '../../common/MiniLoader'
import baseUrl from '../../../shared/baseUrl'

function InviteMemberModal (props) {
  const {
    showModal,
    toggleModal,
    groupId,
    memberUsernames,
    moderatorUsernames,
    user
  } = props
  const router = useRouter()
  const { access_token: accessToken } = user
  const [invitedMembers, setInvitedMembers] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const alreadyMembers = [...memberUsernames, ...moderatorUsernames]
  const addMembers = () => {
    if (!invitedMembers.length) {
      return setError('Please select the users to be added')
    }
    setIsLoading(true)
    setError('')
    var reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    reqHeaders.append('Content-Type', 'application/json')
    const body = {
      members: invitedMembers
    }
    var requestOptions = {
      method: 'POST',
      headers: reqHeaders,
      body: JSON.stringify(body)
    }
    fetch(`${baseUrl}/groups/${groupId}/members`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success, error, results } = res
        if (success) {
          const { invalidUsernames } = results
          if (invalidUsernames && invalidUsernames.length) {
            setError(
              `Following usernames couldn't be added : ${invalidUsernames.join(
                ', '
              )}`
            )
          }
          router.reload()
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
  return <Modal size={'lg'} show={showModal} onHide={toggleModal}>
    <Modal.Body>
      <h5>Add members to group
      </h5>
      <div className="container">
        <Row>
          <Col>
            <SearchUsers
              selectedUsers={invitedMembers}
              setSelectedUsers={setInvitedMembers}
              user={user}
              limit={5}
              alreadySelected={alreadyMembers}
            />
          </Col>
        </Row>
        {error && <Alert variant="danger">{error}</Alert>}
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button variant={'danger'} onClick={toggleModal}>
      Cancel
      </Button>
      <Button variant={'success'} onClick={addMembers} disabled={isLoading}>
                Add members&nbsp;
        {isLoading && <MiniLoader />}
      </Button>
    </Modal.Footer>
  </Modal>
}

InviteMemberModal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  showModal: PropTypes.bool,
  groupId: PropTypes.number.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string,
    access_token: PropTypes.string,
    isAdmin: PropTypes.number
  }),
  memberUsernames: PropTypes.arrayOf(PropTypes.string),
  moderatorUsernames: PropTypes.arrayOf(PropTypes.string)
}

export default InviteMemberModal
