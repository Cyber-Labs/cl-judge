import React, { useState } from 'react'
import { Modal, Button, Alert } from 'react-bootstrap'
import PropTypes from 'prop-types'
import baseUrl from '../../../shared/baseUrl'
import MiniLoader from '../../common/MiniLoader'

function RemoveGroupModal (props) {
  const {
    showModal,
    toggleModal,
    accessToken,
    selectedGroup,
    contestId,
    eligibleGroups,
    setEligibleGroups
  } = props
  if (!selectedGroup) { return <div/> }
  const { group_id: groupId, group_name: groupName, member_count: memberCount } = selectedGroup

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const removeGroup = () => {
    setIsLoading(true)
    setError('')
    const reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    reqHeaders.append('Content-Type', 'application/json')
    const body = {
      group_id: groupId
    }
    const requestOptions = {
      method: 'DELETE',
      headers: reqHeaders,
      body: JSON.stringify(body)
    }
    fetch(`${baseUrl}/contests/${contestId}/groups`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success, error } = res
        if (success) {
          const newEligibleGroups = eligibleGroups.filter(({ group_id: gid }) => gid !== groupId)
          setEligibleGroups(newEligibleGroups)
          toggleModal()
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
  return <Modal show={showModal} onHide={toggleModal}>
    <Modal.Body>
      <h5>Are you sure you want to make the following group ineligible for the contest?
      </h5>
      <div className='container'>
        Group Name: {groupName}<br/>
        Number of members: {memberCount}<br/>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
    </Modal.Body>
    <Modal.Footer>
      <Button variant={'warning'} onClick={toggleModal}>
      Cancel
      </Button>
      <Button variant={'danger'} onClick={removeGroup} disabled={isLoading}>
                Yes, make ineligible&nbsp;
      { isLoading && <MiniLoader />}
      </Button>
    </Modal.Footer>
  </Modal>
}

RemoveGroupModal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  showModal: PropTypes.bool,
  accessToken: PropTypes.string,
  contestId: PropTypes.number.isRequired,
  eligibleGroups: PropTypes.arrayOf(PropTypes.shape({
    group_id: PropTypes.number,
    group_name: PropTypes.string,
    member_count: PropTypes.number
  })),
  selectedGroup: PropTypes.shape({
    group_id: PropTypes.number,
    group_name: PropTypes.string,
    member_count: PropTypes.number
  }),
  setEligibleGroups: PropTypes.func.isRequired
}

export default RemoveGroupModal
