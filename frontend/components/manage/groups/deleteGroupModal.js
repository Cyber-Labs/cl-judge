import React from 'react'
import { useRouter } from 'next/router'
import { Modal, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import baseUrl from '../../../shared/baseUrl'

function DeleteGroupModal (props) {
  const {
    showModal,
    toggleModal,
    groupId,
    accessToken,
    groupName
  } = props
  const router = useRouter()
  const deleteGroup = () => {
    const reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    reqHeaders.append('Content-Type', 'application/json')
    const requestOptions = {
      method: 'DELETE',
      headers: reqHeaders
    }
    fetch(`${baseUrl}/groups/${groupId}`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success, error } = res
        if (success) {
          setTimeout(() => {
            router.replace('/manage/groups')
          }, 500)
        } else {
          alert(error.sqlMessage || error)
        }
      })
      .catch((error) => {
        alert(error.message)
      })
  }
  return <Modal show={showModal} onHide={toggleModal}>
    <Modal.Body>
      <h5>Are you sure you want to delete the group {groupName}?
      </h5>
    </Modal.Body>
    <Modal.Footer>
      <Button variant={'warning'} onClick={toggleModal}>
      Cancel
      </Button>
      <Button variant={'danger'} onClick={deleteGroup}>
                Yes, delete group&nbsp;
      </Button>
    </Modal.Footer>
  </Modal>
}

DeleteGroupModal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  showModal: PropTypes.bool,
  groupId: PropTypes.number.isRequired,
  accessToken: PropTypes.string,
  groupName: PropTypes.string
}

export default DeleteGroupModal
