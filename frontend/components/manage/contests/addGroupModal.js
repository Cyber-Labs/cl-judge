import React, { useState, useEffect } from 'react'
import { Modal, Button, Table, Alert } from 'react-bootstrap'
import PropTypes from 'prop-types'
import MiniLoader from '../../common/MiniLoader'
import baseUrl from '../../../shared/baseUrl'
import Link from 'next/link'

function AddGroupModal (props) {
  const {
    showModal,
    toggleModal,
    contestId,
    alreadySelected,
    setAlreadySelected,
    accessToken
  } = props
  const [moderatorGroups, setModeratorGroups] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState(0)

  useEffect(() => {
    const reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    const requestOptions = {
      method: 'GET',
      headers: reqHeaders
    }
    fetch(`${baseUrl}/groups/moderator_groups`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success, error, results } = res
        if (success) {
          setModeratorGroups(results)
        } else {
          setModeratorGroups([])
          setError(error.sqlMessage || error)
        }
      })
      .catch((error) => {
        setModeratorGroups([])
        setError(error.message)
      })
  }, [])

  const addGroup = (groupId, groupName, memberCount) => {
    setSelectedGroupId(groupId)
    setIsLoading(true)
    setError('')
    const reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    reqHeaders.append('Content-Type', 'application/json')
    const body = {
      group_id: groupId
    }
    const requestOptions = {
      method: 'POST',
      headers: reqHeaders,
      body: JSON.stringify(body)
    }
    fetch(`${baseUrl}/contests/${contestId}/groups`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success, error } = res
        if (success) {
          const newAlreadySelected = [...alreadySelected, { group_id: groupId, group_name: groupName, member_count: memberCount }]
          setAlreadySelected(newAlreadySelected)
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

  const remainingGroups = moderatorGroups.filter(({ id }) => !alreadySelected.some(({ group_id: groupId }) => id === groupId))

  return <Modal size={'lg'} show={showModal} onHide={toggleModal}>
    <Modal.Body>
      <Modal.Header closeButton>
        <Modal.Title>
          Make groups eligible for contest
        </Modal.Title>
      </Modal.Header>
      <br/>
      <div className="container">
        {
          remainingGroups.length
            ? <Table striped bordered hover responsive="md">
          <thead>
            <tr>
              <th>#</th>
              <th>Group Name</th>
              <th>Number of members</th>
              <th>Make eligible</th>
            </tr>
          </thead>
          <tbody>
            {remainingGroups.map(({ id, group_name: groupName, member_count: memberCount }, i) => <tr key={id}>
              <td>{i + 1}</td>
              <td>
                <Link href={`/groups/${id}`} style={{ color: 'black' }}>
                {groupName}
                </Link>
              </td>
              <td>
                {memberCount}
              </td>
              <td>
                <Button
                  variant='success'
                  disabled={isLoading && selectedGroupId === id}
                  onClick={() => {
                    addGroup(id, groupName, memberCount)
                  }}>
                  <i className="fa fa-plus-circle"/> Add
                  {isLoading && selectedGroupId === id && <MiniLoader />}
                </Button>
              </td>
            </tr>)}
          </tbody>
        </Table>
            : <div>You are not the moderator of any ineligible group</div>
        }
        {error && <Alert variant="danger">{error}</Alert>}
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button variant={'danger'} onClick={toggleModal}>
      Close
      </Button>
    </Modal.Footer>
  </Modal>
}

AddGroupModal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  showModal: PropTypes.bool,
  contestId: PropTypes.number.isRequired,
  accessToken: PropTypes.string,
  alreadySelected: PropTypes.arrayOf(PropTypes.shape({
    group_id: PropTypes.number,
    group_name: PropTypes.string,
    member_count: PropTypes.number
  })),
  setAlreadySelected: PropTypes.func.isRequired
}

export default AddGroupModal
