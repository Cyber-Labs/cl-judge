import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Alert, Col } from 'react-bootstrap'
import { Formik } from 'formik'
import * as yup from 'yup'
import CONSTANTS from '../../shared/CONSTANTS'
import baseUrl from '../../shared/baseUrl'
import MiniLoader from '../common/MiniLoader'

const updateUserSchema = yup.object({
  fullName: yup.string().required('Full Name is required'),
  email: yup
    .string()
    .matches(
      '^[a-z]+.[0-9]{2}[a-z]{2}[0-9]{4}@([a-z]{2,4}.)?iitism.ac.in$',
      'Enter a valid iit-ism mail id'
    )
    .required('Email is required'),
  admNo: yup
    .string()
    .length(8, 'Admission number must be exactly 8 characters long')
    .matches(
      '^[0-9]{2}[a-z]{2}[0-9]{4}$',
      'Enter a valid admission number in lowercase'
    )
    .required('Admission Number is required'),
  admissionYear: yup
    .number('Must be a number')
    .required('Admission Year is required'),
  mobile: yup
    .string()
    .matches(
      '^[0-9]{10}$',
      "Don't include country code etc. Must be a 10-digit number"
    )
    .notRequired(),
  bio: yup.string().max(100, 'Bio can have maximum 100 characters')
})

function UpdateUserForm (props) {
  const [updateUserError, setUpdateUserError] = useState('')
  const [updateUserResult, setUpdateUserResult] = useState('')
  const [updateUserProgress, setUpdateUserProgress] = useState(false)

  const {
    accessToken,
    userInfo,
    selectedCourse,
    selectedDepartment,
    setSelectedCourse,
    setSelectedDepartment
  } = props

  const {
    full_name: defaultFullName,
    email: defaultEmail,
    admission_number: defaultAdmissionNumber,
    admission_year: defaultAdmissionYear,
    mobile: defaultMobile,
    bio: defaultBio
  } = userInfo

  var reqHeaders = new Headers()
  reqHeaders.append('access_token', accessToken)

  return (
    <div className="col">
      <Formik
        validationSchema={updateUserSchema}
        onSubmit={(data) => {
          setUpdateUserProgress(true)
          const { fullName, email, admNo, mobile, admissionYear, bio } = data
          var urlencoded = new URLSearchParams()
          const newUserInfo = userInfo
          if (fullName !== defaultFullName) {
            urlencoded.append('full_name', fullName)
            newUserInfo.full_name = fullName
          }
          if (admNo !== defaultAdmissionNumber) {
            urlencoded.append('admission_number', admNo)
            newUserInfo.admission_number = admNo
          }
          if (email !== defaultEmail) {
            urlencoded.append('email', email)
            newUserInfo.email = email
          }

          urlencoded.append('course', selectedCourse)
          urlencoded.append('department', selectedDepartment)
          if (admissionYear !== defaultAdmissionYear) {
            urlencoded.append('admission_year', admissionYear)
            newUserInfo.admission_year = admissionYear
          }
          if (bio !== defaultBio) {
            urlencoded.append('bio', bio)
            newUserInfo.bio = bio
          }
          if (mobile !== defaultMobile && mobile !== '') {
            urlencoded.append('mobile', mobile)
            newUserInfo.mobile = mobile
          }
          console.log(newUserInfo, urlencoded)
          var requestOptions = {
            method: 'POST',
            headers: reqHeaders,
            body: urlencoded
          }
          fetch(`${baseUrl}/user/update_user`, requestOptions)
            .then((res) => res.json())
            .then((res) => {
              const { success, error, results } = res
              if (success) {
                setUpdateUserError('')
                setUpdateUserResult(results)
              } else {
                setUpdateUserResult('')
                if (error.sqlMessage) setUpdateUserError(error.sqlMessage)
                else setUpdateUserError(error)
              }
              setUpdateUserProgress(false)
            })
            .catch((error) => {
              setUpdateUserResult('')
              setUpdateUserError(error.message)
              setUpdateUserProgress(false)
            })
        }}
        initialValues={{
          mobile: defaultMobile || '',
          bio: defaultBio || '',
          admNo: defaultAdmissionNumber,
          fullName: defaultFullName,
          email: defaultEmail,
          admissionYear: defaultAdmissionYear
        }}
      >
        {({ handleSubmit, handleChange, values, touched, errors }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <h4>Basic Information</h4>
            <Form.Row>
              <Form.Group as={Col} controlId="updateUserFullName" md={6}>
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your full name"
                  name="fullName"
                  value={values.fullName}
                  onChange={handleChange}
                  isValid={touched.fullName && !errors.fullName}
                  isInvalid={!!errors.fullName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.fullName}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId="signupAdmNo" md={6}>
                <Form.Label>Admission Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your admission no."
                  name="admNo"
                  value={values.admNo}
                  onChange={handleChange}
                  isValid={touched.admNo && !errors.admNo}
                  isInvalid={!!errors.admNo}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.admNo}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="course" md={6}>
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
              <Form.Group as={Col} controlId="department" md={6}>
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
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="admissionYear" md={6}>
                <Form.Label>Year of admission</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your year of admission"
                  name="admissionYear"
                  value={values.admissionYear}
                  onChange={handleChange}
                  isValid={touched.admissionYear && !errors.admissionYear}
                  isInvalid={!!errors.admissionYear}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.admissionYear}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId="mobile" md={6}>
                <Form.Label>Contact No.</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your contact no."
                  name="mobile"
                  value={values.mobile}
                  onChange={handleChange}
                  isValid={touched.mobile && !errors.mobile}
                  isInvalid={!!errors.mobile}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.mobile}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Group controlId="signupEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your @iitism.ac.in email only"
                name="email"
                value={values.email}
                onChange={handleChange}
                isValid={touched.email && !errors.email}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Your official college email ID
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="bio">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                type="text"
                placeholder="Max 100 characters"
                name="bio"
                value={values.bio}
                onChange={handleChange}
                isValid={touched.bio && !errors.bio}
                isInvalid={!!errors.bio}
              />
              <Form.Control.Feedback type="invalid">
                {errors.bio}
              </Form.Control.Feedback>
            </Form.Group>
            {updateUserError && (
              <Alert variant="danger">{updateUserError}</Alert>
            )}
            <div className="text-center">
              <Button
                variant="success"
                type="submit"
                disabled={updateUserProgress}
              >
                &nbsp;Save &nbsp;
                {updateUserProgress && <MiniLoader />}
              </Button>
            </div>
            <br />
            <br />
            {updateUserResult && (
              <Alert variant="info">{updateUserResult}</Alert>
            )}
          </Form>
        )}
      </Formik>
    </div>
  )
}

UpdateUserForm.propTypes = {
  accessToken: PropTypes.string.isRequired,
  userInfo: PropTypes.shape({
    full_name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    admission_number: PropTypes.string.isRequired,
    admission_year: PropTypes.number.isRequired,
    mobile: PropTypes.string,
    bio: PropTypes.string
  }),
  selectedCourse: PropTypes.number.isRequired,
  selectedDepartment: PropTypes.number.isRequired,
  setSelectedCourse: PropTypes.func.isRequired,
  setSelectedDepartment: PropTypes.func.isRequired
}

export default UpdateUserForm
