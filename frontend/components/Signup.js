import React, { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { Formik } from 'formik'
import * as yup from 'yup'
import baseUrl from '../shared/baseUrl'
import CONSTANTS from '../shared/CONSTANTS'
import MiniLoader from '../components/common/MiniLoader'

const signupSchema = yup.object({
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
  username: yup
    .string()
    .min(4, 'Must be 4 characters or more')
    .required('Username is required'),
  password: yup
    .string()
    .min(8, 'Must be 8 characters or more')
    .required('Password is required'),
  confirmPassword: yup.string().required('Re-enter your password here')
})

function Signup () {
  const [signUpProgress, setSignUpProgress] = useState(false)
  const [signupError, setSignUpError] = useState('')
  const [signupResult, setSignUpResult] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(0)
  const [selectedDepartment, setSelectedDepartment] = useState(0)
  return (
    <Formik
      validationSchema={signupSchema}
      onSubmit={(data) => {
        setSignUpProgress(true)
        const {
          fullName,
          email,
          admNo,
          username,
          password,
          admissionYear
        } = data
        var urlencoded = new URLSearchParams()
        urlencoded.append('username', username)
        urlencoded.append('password', password)
        urlencoded.append('full_name', fullName)
        urlencoded.append('admission_number', admNo)
        urlencoded.append('email', email)
        urlencoded.append('course', selectedCourse)
        urlencoded.append('department', selectedDepartment)
        urlencoded.append('admission_year', admissionYear)

        console.log(urlencoded)
        var requestOptions = {
          method: 'POST',
          body: urlencoded
        }

        fetch(`${baseUrl}/auth/signup`, requestOptions)
          .then((res) => res.json())
          .then((res) => {
            const { success, error, results } = res
            if (success) {
              setSignUpError('')
              setSignUpResult(results)
            } else {
              setSignUpResult('')
              if (error.sqlMessage) setSignUpError(error.sqlMessage)
              else setSignUpError(error)
            }
            setSignUpProgress(false)
          })
          .catch((error) => {
            setSignUpResult('')
            setSignUpError(error.message)
            setSignUpProgress(false)
          })
      }}
      initialValues={{
        username: '',
        password: '',
        confirmPassword: '',
        admNo: '',
        fullName: '',
        email: ''
      }}
    >
      {({ handleSubmit, handleChange, values, touched, errors }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <br />
          <h4>Join CL Judge</h4>
          <br />
          <Form.Group controlId="signupFullName">
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
              Enter your official college email ID
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="signupAdmNo">
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
          <Form.Group controlId="signupUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter a username for CL Judge"
              name="username"
              value={values.username}
              onChange={handleChange}
              isValid={touched.username && !errors.username}
              isInvalid={!!errors.username}
            />
            <Form.Control.Feedback type="invalid">
              {errors.username}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="course">
            <Form.Label>Course</Form.Label>
            <Form.Control
              as="select"
              defaultValue={CONSTANTS.COURSES[0]}
              onClick={(e) => {
                setSelectedCourse(e.target.value)
                console.log(e.target.value)
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
                console.log(e.target.value)
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
          <Form.Group controlId="signupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter a password for OJ"
              name="password"
              value={values.password}
              onChange={handleChange}
              isValid={touched.password && !errors.password}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="signupConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Re-enter your password"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              isValid={
                touched.confirmPassword &&
                !errors.confirmPassword &&
                values.confirmPassword === values.password
              }
              isInvalid={!!errors.confirmPassword}
            />
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword}
            </Form.Control.Feedback>
          </Form.Group>
          {signupError && <Alert variant="danger">{signupError}</Alert>}
          <div className="text-center">
            <Button variant="primary" type="submit">
              Sign Up &nbsp;
              {signUpProgress && <MiniLoader />}
            </Button>
          </div>
          <br />
          <br />
          {signupResult && <Alert variant="info">{signupResult}</Alert>}
        </Form>
      )}
    </Formik>
  )
}

export default Signup
