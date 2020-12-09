import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { Modal, Button, Form, Alert } from 'react-bootstrap'
import PropTypes from 'prop-types'
import CONSTANTS from '../../../shared/CONSTANTS'
import MiniLoader from '../../common/MiniLoader'
import baseUrl from '../../../shared/baseUrl'

function AddBranchModal (props) {
  const {
    showModal,
    toggleModal,
    groupId,
    accessToken
  } = props
  const router = useRouter()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(0)
  const [selectedDepartment, setSelectedDepartment] = useState(0)
  const [admissionYear, setAdmissionYear] = useState(2020)
  const addBranch = () => {
    setIsLoading(true)
    setError('')
    var reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    reqHeaders.append('Content-Type', 'application/json')
    const body = {
      department: selectedDepartment,
      course: selectedCourse,
      admission_year: admissionYear
    }
    var requestOptions = {
      method: 'POST',
      headers: reqHeaders,
      body: JSON.stringify(body)
    }
    fetch(`${baseUrl}/groups/${groupId}/branch`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success, error } = res
        if (success) {
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
      <h5>Add branch to group
      </h5>
      <div className="container">
        <Form>
          <Form.Group controlId="course">
            <Form.Label>Course</Form.Label>
            <Form.Control
              as="select"
              defaultValue={CONSTANTS.COURSES[0]}
              onClick={(e) => {
                setSelectedCourse(e.target.value)
              }}
            >
              {CONSTANTS.COURSES.map((course, index) => (
                <option value={index} key={course}>
                  {course}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="department">
            <Form.Label>Department</Form.Label>
            <Form.Control
              as="select"
              defaultValue={CONSTANTS.DEPARTMENTS[0]}
              onClick={(e) => {
                setSelectedDepartment(e.target.value)
              }}
            >
              {CONSTANTS.DEPARTMENTS.map((dept, index) => (
                <option key={dept} value={index}>
                  {dept}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="admissionYear">
            <Form.Label>Year of admission (in YYYY format)</Form.Label>
            <Form.Control
              type="number"
              placeholder="eg. 2018"
              name="admissionYear"
              value={admissionYear}
              onChange={(e) => {
                setAdmissionYear(e.target.value)
              }}
            />
          </Form.Group>
        </Form>
        {error && <Alert variant="danger">{error}</Alert>}
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button variant={'danger'} onClick={toggleModal}>
      Cancel
      </Button>
      <Button variant={'success'} onClick={addBranch} disabled={isLoading}>
                Add branch&nbsp;
        {isLoading && <MiniLoader />}
      </Button>
    </Modal.Footer>
  </Modal>
}

AddBranchModal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  showModal: PropTypes.bool,
  groupId: PropTypes.number.isRequired,
  accessToken: PropTypes.string
}

export default AddBranchModal
