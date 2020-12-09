import React from 'react'
import { Modal, Button, Row, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import CONSTANTS from '../../../shared/CONSTANTS'

function MemberConfirmModal (props) {
  const {
    username,
    fullName,
    admissionNumber,
    profileImage,
    email,
    course,
    department,
    onConfirm,
    showModal,
    toggleModal,
    confirmationMessage,
    negative
  } = props

  return <Modal show={showModal} onHide={toggleModal}>
    <Modal.Body>
      <h5>{confirmationMessage}
      </h5>
      <div className="container">
        <Row>
          <Col>
            <img
              src={profileImage || '/images/profile.png'}
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
            <h6>Admission Number : {admissionNumber}</h6>
            <h6>Username : {username}</h6>
            <h6>Course : {CONSTANTS.COURSES[course]}</h6>
            <h6>Department : {CONSTANTS.DEPARTMENTS[department]}</h6>
            <h6>Email : {email}</h6>
          </Col>
        </Row>
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button variant={negative ? 'warning' : 'danger'} onClick={toggleModal}>
      Cancel
      </Button>
      <Button variant={negative ? 'danger' : 'success'} onClick={onConfirm}>
      Yes
      </Button>
    </Modal.Footer>
  </Modal>
}

MemberConfirmModal.propTypes = {
  username: PropTypes.string,
  fullName: PropTypes.string,
  admissionNumber: PropTypes.string,
  profileImage: PropTypes.string,
  email: PropTypes.string,
  course: PropTypes.number,
  department: PropTypes.number,
  onConfirm: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  showModal: PropTypes.bool,
  confirmationMessage: PropTypes.string,
  negative: PropTypes.bool
}

export default MemberConfirmModal
