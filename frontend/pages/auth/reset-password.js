import React, { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import baseUrl from '../../shared/baseUrl'
import { Formik } from 'formik'
import * as yup from 'yup'
import Link from 'next/link'

const resetPasswordSchema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup
    .string()
    .min(8, 'Should consist of 8 or more characters')
    .required('Password is required'),
  confirmPassword: yup.string().required('Re-enter the above password again'),
  otp: yup.string().required('OTP is required')
})

function ResetPassword () {
  const [errorMessage, setErrorMessage] = useState('')
  const [resultMessage, setResultMessage] = useState(false)
  return (
    <div
      className="container gray-bg mt-4 ml-auto"
      style={{ width: '500px', padding: '30px', borderRadius: '10px' }}
    >
      <h4 align="center">Reset Password</h4>
      <br />
      <Formik
        validationSchema={resetPasswordSchema}
        onSubmit={(data) => {
          const { username, password, confirmPassword, otp } = data
          const urlencoded = new URLSearchParams()
          urlencoded.append('username', username)
          urlencoded.append('password', password)
          urlencoded.append('password_confirm', confirmPassword)
          urlencoded.append('otp', otp)
          const requestOptions = {
            method: 'POST',
            body: urlencoded
          }

          fetch(`${baseUrl}/auth/reset_password`, requestOptions)
            .then((res) => res.json())
            .then((res) => {
              const { success, error } = res
              if (success) {
                setResultMessage(true)
                setErrorMessage('')
              } else {
                if (error.sqlMessage) setErrorMessage(error.sqlMessage)
                else setErrorMessage(error)
                setResultMessage(false)
              }
            })
            .catch((error) => {
              setErrorMessage(error.message)
              setResultMessage(false)
            })
        }}
        initialValues={{
          username: '',
          password: '',
          confirmPassword: '',
          otp: ''
        }}
      >
        {({ handleSubmit, handleChange, values, touched, errors }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Control
                type="text"
                placeholder="Enter your OJ username"
                name="username"
                value={values.username}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>New password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
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
            <Form.Group controlId="confirmPassword">
              <Form.Label>Re-enter new password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                isValid={touched.confirmPassword && !errors.confirmPassword}
                isInvalid={!touched.confirmPassword || !!errors.confirmPassword}
              />
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="otp">
              <Form.Control
                type="text"
                placeholder="Enter your OTP"
                name="otp"
                value={values.otp}
                onChange={handleChange}
              />
            </Form.Group>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <br />
            <div className="text-center">
              <Button type="submit">Change Password</Button>
            </div>
            <br />
            <br />
            {resultMessage && (
              <Alert variant="success">
                Password reset successfully. Now, you can log in to your account{' '}
                <Link href="/">
                  <a href="/">here</a>
                </Link>
              </Alert>
            )}
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default ResetPassword
