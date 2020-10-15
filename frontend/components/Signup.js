import React, { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { Formik } from 'formik'
import * as yup from 'yup'
import baseUrl from '../shared/baseUrl'

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
  username: yup
    .string()
    .min(4, 'Must be 4 characters or more')
    .required('Username is required'),
  password: yup
    .string()
    .min(8, 'Must be 8 characters or more')
    .required('Password is required'),
  confirmPassword: yup.string().required('Re-enter your password here'),
  mobile: yup
    .string()
    .matches(
      '^[0-9]{10}$',
      "Don't include country code etc. Must be a 10-digit number"
    )
    .required('Contact No. is required')
})

function Signup () {
  const [signupError, setSignUpError] = useState('')
  const [signupResult, setSignUpResult] = useState('')
  return (
    <Formik
      validationSchema={signupSchema}
      onSubmit={(data) => {
        const { fullName, email, admNo, username, password, mobile } = data
        var urlencoded = new URLSearchParams()
        urlencoded.append('username', username)
        urlencoded.append('password', password)
        urlencoded.append('full_name', fullName)
        urlencoded.append('admission_number', admNo)
        urlencoded.append('email', email)
        urlencoded.append('mobile', mobile)

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
          })
          .catch((error) => {
            setSignUpResult('')
            setSignUpError(error)
          })
      }}
      initialValues={{
        username: '',
        password: '',
        confirmPassword: '',
        admNo: '',
        fullName: '',
        mobile: '',
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
              isInvalid={!touched.fullName || !!errors.fullName}
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
              isInvalid={!touched.email || !!errors.email}
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
              isInvalid={!touched.admNo || !!errors.admNo}
            />
            <Form.Control.Feedback type="invalid">
              {errors.admNo}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="signupUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter a username for OJ"
              name="username"
              value={values.username}
              onChange={handleChange}
              isValid={touched.username && !errors.username}
              isInvalid={!touched.username || !!errors.username}
            />
            <Form.Control.Feedback type="invalid">
              {errors.username}
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
              isInvalid={!touched.password || !!errors.password}
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
              isInvalid={!touched.confirmPassword || !!errors.confirmPassword}
            />
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="signupMobile">
            <Form.Label>Contact No.</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your contact no."
              name="mobile"
              value={values.mobile}
              onChange={handleChange}
              isValid={touched.mobile && !errors.mobile}
              isInvalid={!touched.mobile || !!errors.mobile}
            />
            <Form.Control.Feedback type="invalid">
              {errors.mobile}
            </Form.Control.Feedback>
          </Form.Group>
          {signupError && <Alert variant="danger">{signupError}</Alert>}
          <div className="text-center">
            <Button variant="primary" type="submit">
              Sign Up
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
